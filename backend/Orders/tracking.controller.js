const Order = require("../models/newOrder.model");
const Wallet = require("../models/wallet");
const User = require("../models/User.model");
const DTDCStatusMapping = require("../statusMap/DTDCStatusMapping");
const SmartShipStatusMapping = require("../statusMap/SmartShipStatusMapping");
const DelhiveryStatusMapping = require("../statusMap/DelhiveryStatusMapping");
const AmazonStatusMapping = require("../statusMap/AmazonStatusMapping");
const ecomExpressStatusMapping = require("../statusMap/EcomStatusMapping");
const cron = require("node-cron");
const {
  shipmentTrackingforward,
} = require("../AllCouriers/EcomExpress/Couriers/couriers.controllers");
const {
  trackShipment,
} = require("../AllCouriers/Xpressbees/MainServices/mainServices.controller");
const {
  trackShipmentDelhivery,
} = require("../AllCouriers/Delhivery/Courier/couriers.controller");
const {
  getShipmentTracking,
} = require("../AllCouriers/Amazon/Courier/couriers.controller");
const {
  trackOrderShreeMaruti,
} = require("../AllCouriers/ShreeMaruti/Couriers/couriers.controller");
const {
  trackOrderDTDC,
} = require("../AllCouriers/DTDC/Courier/couriers.controller");
const {
  trackOrderSmartShip,
} = require("../AllCouriers/SmartShip/Couriers/couriers.controller");
const Bottleneck = require("bottleneck");
const orderSchemaModel = require("../models/orderSchema.model");

const limiter = new Bottleneck({
  minTime: 1000, // 10 requests per second (1000ms delay between each)
  maxConcurrent: 10, // Maximum 10 at the same time
  reservoir: 750, // Max 750 calls per minute
  reservoirRefreshAmount: 750,
  reservoirRefreshInterval: 60 * 1000, // Refresh every 1 minute
});

const trackSingleOrder = async (order) => {
  try {
    // console.log("Tracking order:", order.orderId);
    const { provider, awb_number, shipment_id } = order;
    if (!provider || !awb_number) return;

    const currentWallet = await Wallet.findById(
      (
        await User.findById((await Order.findOne({ awb_number })).userId)
      ).Wallet
    );

    const trackingFunctions = {
      Xpressbees: trackShipment,
      Delhivery: trackShipmentDelhivery,
      ShreeMaruti: trackOrderShreeMaruti,
      DTDC: trackOrderDTDC,
      EcomExpress: shipmentTrackingforward,
      Amazon: getShipmentTracking,
      Smartship: trackOrderSmartShip,
    };

    if (!trackingFunctions[provider]) {
      console.warn(`Unknown provider: ${provider} for Order ID: ${order._id}`);
      return;
    }

    const result = await trackingFunctions[provider](awb_number, shipment_id);
    if (!result || !result.success || !result.data) return;

    const normalizedData = mapTrackingResponse(result.data, provider);
    if (!normalizedData) {
      console.warn(`Failed to map tracking data for AWB: ${awb_number}`);
      return;
    }
    let shouldUpdateWallet = false;
    let balanceTobeAdded = 0;

    if (provider === "EcomExpress") {
      const instruction = normalizedData.Instructions?.toLowerCase();
      order.status = ecomExpressStatusMapping[instruction];

      if (ecomExpressStatusMapping[instruction] === "Out for Delivery") {
        order.ndrStatus = "Out for Delivery";
      }
      console.log("status", normalizedData.Status, normalizedData.Instructions);

      if (order.status === "RTO In-transit" && result.rto_awb) {
        order.awb_number = result.rto_awb;
      } else {
        order.awb_number = result.data.awb_number;
      }
      if (
        normalizedData.Status === "Returned" &&
        normalizedData.Instructions === "Undelivered"
      ) {
        console.log("rto", order.awb_number);
        order.status = "RTO In-transit";
        order.ndrStatus = "RTO In-transit";
      }
      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        (instruction === "bagged" ||
          instruction === "bag added to connection" ||
          instruction === "departed from location" ||
          instruction === "bag inscan at location" ||
          instruction === "shipment debagged at location")
      ) {
        order.status = "RTO In-transit";
        order.ndrStatus = "RTO In-transit";
      }
      if (
        (order.ndrStatus === "Undelivered" ||
          order.ndrStatus === "Out for Delivery") &&
        normalizedData.Instructions === "Delivered"
      ) {
        order.ndrStatus = "Delivered";
      }

      if (
        normalizedData.Instructions === "Undelivered" &&
        order.ndrStatus !== "Action_Requested" &&
        normalizedData.Instructions !== "Out for delivery"
      ) {
        order.status = "Undelivered";
        order.ndrStatus = "Undelivered";
        order.ndrReason = {
          date: normalizedData.StatusDateTime,
          reason: normalizedData.ReasonCode,
        };
        // if (!Array.isArray(order.ndrHistory)) {
        //   order.ndrHistory = [];
        // }
        const lastEntryDate = new Date(
          order.ndrHistory[order.ndrHistory.length - 1]?.date
        ).toDateString();
        const currentStatusDate = new Date(
          normalizedData.StatusDateTime
        ).toDateString();

        if (
          order.ndrHistory.length === 0 ||
          lastEntryDate !== currentStatusDate
        ) {
          const attemptCount = order.ndrHistory?.length || 0;
          if (normalizedData.Instructions === "Undelivered") {
            // console.log("ecom", normalizedData.ReasonCode);

            order.ndrHistory.push({
              date: normalizedData.StatusDateTime,
              action: "Auto Reattempt",
              remark: normalizedData.ReasonCode,
              attempt: attemptCount + 1,
            });
          }
        }
      }

      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        instruction === "delivered"
      ) {
        order.status = "RTO Delivered";
        order.ndrStatus = "RTO Delivered";
      }
    }
    if (provider === "DTDC") {
      const instruction = normalizedData.Instructions?.toLowerCase();
      order.status = DTDCStatusMapping[instruction];

      if (order.status === "RTO") {
        order.ndrStatus = "RTO";
      }
      if (order.status === "RTO In-transit") {
        order.ndrStatus = "RTO In-transit";
      }

      if (DTDCStatusMapping[instruction] === "Out for Delivery") {
        order.ndrStatus = "Out for Delivery";
      }
      if (
        (order.ndrStatus === "Undelivered" ||
          order.ndrStatus === "Out for Delivery" ||
          order.ndrStatus === "Action_Requested") &&
        normalizedData.Instructions === "Delivered"
      ) {
        order.ndrStatus = "Delivered";
      }
      const trackingLength = order.tracking?.length || 0;
      const previousStatus =
        trackingLength >= 2 ? order.tracking[trackingLength - 2]?.status : null;
      if (
        normalizedData.Instructions === "Return as per client instruction." &&
        (trackingLength === 0 ||
          (previousStatus !== "NONDLV" &&
            previousStatus !== "Not Delivered" &&
            previousStatus !== "SETRTO"))
      ) {
        // console.log("awb with number", awb_number);
        order.status = "Cancelled";
        order.ndrStatus = "Cancelled";
        balanceTobeAdded =
          order.totalFreightCharges === "N/A"
            ? 0
            : parseInt(order.totalFreightCharges);
        shouldUpdateWallet = true;
      }

      if (normalizedData.Status === "SETRTO") {
        order.reattempt = true;
      } else {
        order.reattempt = false;
      }

      if (
        DTDCStatusMapping[instruction] === "Undelivered" ||
        normalizedData.Instructions === "RTO Not Delivered"
      ) {
        order.status = "Undelivered";
        order.ndrStatus = "Undelivered";
        updateNdrHistoryByAwb(order.awb_number);
        order.ndrReason = {
          date: normalizedData.StatusDateTime,
          reason: normalizedData.StrRemarks,
        };
        // if (!Array.isArray(order.ndrHistory)) {
        //   order.ndrHistory = [];
        // }
        const lastEntryDate = new Date(
          order.ndrHistory[order.ndrHistory.length - 1]?.date
        ).toDateString();
        const currentStatusDate = new Date(
          normalizedData.StatusDateTime
        ).toDateString();

        if (
          lastEntryDate !== currentStatusDate ||
          order.ndrHistory.length === 0
        ) {
          const attemptCount = order.ndrHistory?.length+1 || 0;
          if (DTDCStatusMapping[instruction] === "Undelivered") {
            // Create a new history entry with one action inside
            const newHistoryEntry = {
              actions: [
                {
                  action: `NDR ${attemptCount} Raised`,
                  actionBy: order.courierServiceName,
                  remark: normalizedData.StrRemarks,
                  source: order.provider,
                  date: normalizedData.StatusDateTime,
                },
              ],
            };

            order.ndrHistory.push(newHistoryEntry);
          }
        }
      }

      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        instruction === "rto delivered"
      ) {
        order.status = "RTO Delivered";
        order.ndrStatus = "RTO Delivered";
      }
      if (
        instruction === "delivered" ||
        instruction === "otp based delivered"
      ) {
        order.status = "Delivered";
        // order.ndrStatus = "Delivered";
      }
    }
    if (provider === "Amazon") {
      if (normalizedData.ShipmentType === "FORWARD") {
        if (normalizedData.Instructions === "ReadyForReceive") {
          order.status = "Ready To Ship";
        }

        if (
          normalizedData.Instructions === "PickupDone" ||
          normalizedData.Instructions === "ArrivedAtCarrierFacility" ||
          normalizedData.Instructions === "Departed"
        ) {
          order.status = "In-transit";
        }

        if (normalizedData.Instructions === "OutForDelivery") {
          order.status = "Out for Delivery";
          order.ndrStatus = "Out for Delivery";
        }

        if (normalizedData.Instructions === "Delivered") {
          order.status = "Delivered";
        }

        if (
          (order.ndrStatus === "Undelivered" ||
            order.ndrStatus === "Out for Delivery" ||
            order.ndrStatus === "Action_Requested") &&
          normalizedData.Instructions === "Delivered"
        ) {
          order.ndrStatus = "Delivered";
        }

        // Detect Delivery Attempted
        const secondLastTracking =
          Array.isArray(order.tracking) && order.tracking.length >= 2
            ? order.tracking[order.tracking.length - 2]
            : null;

        const wasPreviousDeliveryAttempted =
          secondLastTracking?.Instructions === "DeliveryAttempted";

        if (
          normalizedData.Instructions === "DeliveryAttempted" ||
          wasPreviousDeliveryAttempted
        ) {
          order.status = "Undelivered";
          order.ndrStatus = "Undelivered";
          updateNdrHistoryByAwb(order.awb_number);

          order.ndrReason = {
            date: normalizedData.StatusDateTime,
            reason: normalizedData.StrRemarks,
          };

          const lastEntryDate = new Date(
            order.ndrHistory[order.ndrHistory.length - 1]?.actions?.[0]?.date
          ).toDateString();

          const currentStatusDate = new Date(
            normalizedData.StatusDateTime
          ).toDateString();

          if (
            order.ndrHistory.length === 0 ||
            lastEntryDate !== currentStatusDate
          ) {
            const attemptCount = order.ndrHistory?.length+1 || 0;
            // Create a new NDR history entry with one action
            const newHistoryEntry = {
              actions: [
                {
                  action: `NDR ${attemptCount} Raised`,
                  actionBy: order.courierServiceName,
                  remark: normalizedData.StrRemarks,
                  source: order.provider,
                  date: normalizedData.StatusDateTime,
                },
              ],
            };

            order.ndrHistory.push(newHistoryEntry);
          }
        }
      } else {
        // RTO flow
        if (
          normalizedData.Instructions === "ReturnInitiated" &&
          order.status === "Undelivered"
        ) {
          order.status = "RTO";
          order.ndrStatus = "RTO";
        }

        if (
          normalizedData.Instructions === "ArrivedAtCarrierFacility" ||
          normalizedData.Instructions === "Departed" ||
          normalizedData.Instructions ===
            "Package arrived at the carrier facility" ||
          normalizedData.Instructions ===
            "Package has left the carrier facility"
        ) {
          order.status = "RTO In-transit";
          order.ndrStatus = "RTO In-transit";
        }

        if (normalizedData.Instructions === "ReturnInitiated") {
          order.status = "RTO In-transit";
        }

        if (normalizedData.Instructions === "Delivered") {
          order.status = "RTO Delivered";
          order.ndrStatus = "RTO Delivered";
        }
      }
    }

    if (provider === "Smartship") {
      const instruction = normalizedData.Instructions?.toLowerCase();
      const Status = normalizedData.Status?.toLowerCase();
      order.status = SmartShipStatusMapping[Status];

      if (order.status === "RTO") {
        order.ndrStatus = "RTO";
      }

      if (
        instruction !== "rto  shipper request" &&
        normalizedData.Status === "Return To Origin"
      ) {
        order.status = "RTO In-transit";
        order.ndrStatus = "RTO In-transit";
      }

      if (SmartShipStatusMapping[instruction] === "Out for Delivery") {
        order.ndrStatus = "Out for Delivery";
      }

      if (
        (order.ndrStatus === "Undelivered" ||
          order.ndrStatus === "Out for Delivery" ||
          order.ndrStatus === "Action_Requested") &&
        (instruction === "shipment delivered" ||
          normalizedData.Instructions === "Delivery Confirmed by Customer")
      ) {
        order.ndrStatus = "Delivered";
      }

      // --- NDR Case ---
      if (SmartShipStatusMapping[instruction] === "Undelivered") {
        order.status = "Undelivered";

        updateNdrHistoryByAwb(order.awb_number);

        order.ndrReason = {
          date: normalizedData.StatusDateTime,
          reason: normalizedData.StrRemarks,
        };

        const lastEntryDate = new Date(
          order.ndrHistory[order.ndrHistory.length - 1]?.actions?.[0]?.date
        ).toDateString();

        const currentStatusDate = new Date(
          normalizedData.StatusDateTime
        ).toDateString();

        if (
          order.ndrHistory.length === 0 ||
          lastEntryDate !== currentStatusDate
        ) {
          order.ndrStatus = "Undelivered";
          const attemptCount = order.ndrHistory?.length+1 || 0;
          // Create new structured history entry
          const newHistoryEntry = {
            actions: [
              {
                action: `NDR ${attemptCount} Raised`,
                actionBy: order.courierServiceName,
                remark: normalizedData.StrRemarks,
                source: order.provider,
                date: normalizedData.StatusDateTime,
              },
            ],
          };

          order.ndrHistory.push(newHistoryEntry);
        }
      }

      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        normalizedData.Status === "RTO Delivered To Shipper" &&
        normalizedData.Instructions === "SHIPMENT DELIVERED"
      ) {
        order.status = "RTO Delivered";
        order.ndrStatus = "RTO Delivered";
      }

      if (
        (instruction === "delivered" ||
          instruction === "delivery confirmed by customer") &&
        normalizedData.Status !== "RTO Delivered To Shipper"
      ) {
        order.status = "Delivered";
      }
    }
    if (provider === "Vamaship") {
      const instruction = normalizedData.Instructions?.toLowerCase();
      // console.log("Smartship instruction", instruction);
      order.status = SmartShipStatusMapping[instruction];
      if (order.status === "RTO") {
        order.ndrStatus = "RTO";
      }
      // console.log("Smartship instruction", instruction);
      if (
        instruction !== "rto  shipper request" &&
        normalizedData.Status === "Return To Origin"
      ) {
        order.status = "RTO In-transit";
        order.ndrStatus = "RTO In-transit";
      }

      if (SmartShipStatusMapping[instruction] === "Out for Delivery") {
        order.ndrStatus = "Out for Delivery";
      }
      if (
        (order.ndrStatus === "Undelivered" ||
          order.ndrStatus === "Out for Delivery") &&
        (instruction === "shipment delivered" ||
          normalizedData.Instructions === "Delivery Confirmed by Customer")
      ) {
        order.ndrStatus = "Delivered";
      }
      if (SmartShipStatusMapping[instruction] === "Undelivered") {
        order.status = "Undelivered";
        order.ndrStatus = "Undelivered";
        updateNdrHistoryByAwb(order.awb_number);
        order.ndrReason = {
          date: normalizedData.StatusDateTime,
          reason: normalizedData.StrRemarks,
        };
        // if (!Array.isArray(order.ndrHistory)) {
        //   order.ndrHistory = [];
        // }
        const lastEntryDate = new Date(
          order.ndrHistory[order.ndrHistory.length - 1]?.date
        ).toDateString();
        const currentStatusDate = new Date(
          normalizedData.StatusDateTime
        ).toDateString();

        if (
          lastEntryDate !== currentStatusDate ||
          order.ndrHistory.length === 0
        ) {
          const attemptCount = order.ndrHistory?.length+1 || 0;
          if (SmartShipStatusMapping[instruction] === "Undelivered") {
            // process.exit(1)
            order.ndrHistory.push({
              date: normalizedData.StatusDateTime,
              action: "Auto Reattempt",
              remark: normalizedData.StrRemarks,
              attempt: attemptCount + 1,
            });
          }
        }
      }

      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        (instruction === "rto delivered to shipper" ||
          instruction === "rto delivered to fc")
      ) {
        order.status = "RTO Delivered";
        order.ndrStatus = "RTO Delivered";
      }
      if (
        instruction === "delivered" ||
        instruction === "delivery confirmed by customer"
      ) {
        order.status = "Delivered";
        // order.ndrStatus = "Delivered";
      }
    } else {
      const statusMap = {
        "UD:Manifested": { status: "Ready To Ship" },
        "UD:In Transit": { status: "In-transit" },
        "UD:Dispatched": {
          status: "Out for Delivery",
          ndrStatus: "Out for Delivery",
        },
        "RT:In Transit": {
          status: "RTO In-transit",
          ndrStatus: "RTO In-transit",
        },
        "DL:RTO": { status: "RTO Delivered", ndrStatus: "RTO Delivered" },
        "DL:Delivered": { status: "Delivered" },
      };

      const key = `${normalizedData.StatusType}:${normalizedData.Status}`;
      const mapped = statusMap[key];

      if (mapped) {
        order.status = mapped.status;
        if (mapped.ndrStatus) order.ndrStatus = mapped.ndrStatus;
      } else if (
        normalizedData.StatusType === "UD" &&
        normalizedData.Status === "Pending" &&
        normalizedData.StatusCode === "ST-108"
      ) {
        order.status = "RTO";
      }

      if (
        (order.ndrStatus === "Undelivered" ||
          order.ndrStatus === "Out for Delivery") &&
        normalizedData.Status === "Delivered"
      ) {
        order.ndrStatus = "Delivered";
      }

      const eligibleNSLCodes = [
        "EOD-74",
        "EOD-15",
        "EOD-104",
        "EOD-43",
        "EOD-86",
        "EOD-11",
        "EOD-69",
        "EOD-6",
      ];

      const lastEntryDate = new Date(
        order.ndrHistory[order.ndrHistory.length - 1]?.actions?.[0]?.date
      ).toDateString();

      const currentStatusDate = new Date(
        normalizedData.StatusDateTime
      ).toDateString();

      if (
        order.ndrHistory.length === 0 ||
        lastEntryDate !== currentStatusDate
      ) {
        if (
          normalizedData.StatusCode &&
          eligibleNSLCodes.includes(normalizedData.StatusCode)
        ) {
          order.ndrStatus = "Undelivered";
          order.status = "Undelivered";
          updateNdrHistoryByAwb(order.awb_number);
          order.ndrReason = {
            date: normalizedData.StatusDateTime,
            reason: normalizedData.Instructions,
          };
          const attemptCount = order.ndrHistory?.length+1 || 0;
          // New structured entry
          const newHistoryEntry = {
            actions: [
              {
                action: `NDR ${attemptCount} Raised`,
                actionBy: order.courierServiceName,
                remark: normalizedData.Instructions,
                source: order.provider,
                date: normalizedData.StatusDateTime,
              },
            ],
          };

          order.ndrHistory.push(newHistoryEntry);
        }
      }
    }

    const lastTrackingEntry = order.tracking[order.tracking.length - 1];

    const isSameCheckpoint =
      lastTrackingEntry &&
      lastTrackingEntry.StatusLocation === normalizedData.StatusLocation &&
      new Date(lastTrackingEntry.StatusDateTime).getTime() ===
        new Date(normalizedData.StatusDateTime).getTime();

    if (isSameCheckpoint) {
      // Just update the last entry if the checkpoint is the same
      lastTrackingEntry.status = normalizedData.Status;
      lastTrackingEntry.Instructions = normalizedData.Instructions;
      await order.save();
    } else if (
      !lastTrackingEntry ||
      lastTrackingEntry?.Instructions !== normalizedData.Instructions
    ) {
      // It's a new checkpoint, so push it
      order.tracking.push({
        status: normalizedData.Status,
        StatusLocation: normalizedData.StatusLocation,
        StatusDateTime: normalizedData.StatusDateTime,
        Instructions: normalizedData.Instructions,
      });
      await order.save();
      console.log("saved");
      if (shouldUpdateWallet && balanceTobeAdded > 0) {
        // Step 0: Check if same awb_number already exists twice
        const awbCount = await Wallet.aggregate([
          { $match: { _id: currentWallet._id } },
          { $unwind: "$transactions" },
          { $match: { "transactions.awb_number": order.awb_number || "" } },
          { $count: "count" },
        ]);

        const existingCount = awbCount[0]?.count || 0;

        if (existingCount >= 2) {
          console.log(
            `Skipping wallet update for AWB: ${order.awb_number}, already logged twice.`
          );
          return; // Exit if already present twice
        }

        // Step 1: Update balance
        await Wallet.updateOne(
          { _id: currentWallet._id },
          { $inc: { balance: balanceTobeAdded } }
        );

        // Step 2: Get updated wallet balance
        const updatedWallet = await Wallet.findById(currentWallet._id);

        // Step 3: Push the transaction with correct balance
        await Wallet.updateOne(
          { _id: currentWallet._id },
          {
            $push: {
              transactions: {
                channelOrderId: order.orderId || null,
                category: "credit",
                amount: balanceTobeAdded,
                balanceAfterTransaction: updatedWallet.balance,
                date: new Date().toISOString().slice(0, 16).replace("T", " "),
                awb_number: order.awb_number || "",
                description: "Freight Charges Received",
              },
            },
          }
        );

        console.log(
          "Wallet updated for AWB:",
          order.awb_number,
          "Amount:",
          balanceTobeAdded
        );
      }
    }
  } catch (error) {
    console.error(
      `Error tracking order ID: ${order._id}, AWB: ${order.awb_number} ${error}`
    );
  }
};

// Main controller
const trackOrders = async () => {
  try {
    const pLimit = await import("p-limit").then((mod) => mod.default);
    const limit = pLimit(10); // Max 10 concurrent executions

    const allOrders = await Order.find({
      status: { $nin: ["new", "Cancelled", "Delivered", "RTO Delivered"] },
    });

    console.log(`📦 Found ${allOrders.length} orders to track`);

    const limitedTrack = limiter.wrap(trackSingleOrder); // apply rate limiter

    const trackingPromises = allOrders.map(
      (order) => limit(() => limitedTrack(order)) // limit concurrency
    );

    await Promise.all(trackingPromises);

    console.log("✅ All tracking updates completed");
  } catch (error) {
    console.error("❌ Error in tracking orders:", error);
  }
};

const startTrackingLoop = async () => {
  try {
    console.log("🕒 Starting Order Tracking");
    await trackOrders();
    console.log("⏳ Waiting for 1 hours before next tracking cycle...");
    setTimeout(startTrackingLoop, 1 * 60 * 60 * 1000); // Wait 3 hours, then call again
  } catch (error) {
    console.error("❌ Error in tracking loop:", error);
    setTimeout(startTrackingLoop, 15 * 60 * 1000); // Retry after 5 minutes even on error
  }
};

startTrackingLoop();

const mapTrackingResponse = (data, provider) => {
  if (provider === "Smartship") {
    // console.log("Smartship data", data);
    const scans = data?.scans;
    const orderId = Object.keys(scans || {})[0]; // only one AWB per call
    const scanArray = scans?.[orderId];
    const latestScan = scanArray?.[0];
    // console.log("latestScan", latestScan);
    return {
      Status: latestScan?.status_description || "N/A",
      StrRemarks: latestScan?.status_description || "N/A",
      StatusLocation: latestScan?.location || "Unknown",
      StatusDateTime: formatSmartShipDateTime(latestScan?.date_time) || null,
      Instructions: latestScan?.action || "N/A",
    };
  }
  const providerMappings = {
    EcomExpress: {
      Status: data.rts_system_delivery_status || "N/A",
      StatusLocation: data.current_location_name || "N/A",
      StatusDateTime: data.last_update_datetime || null,
      Instructions: data.tracking_status || null,
      ReasonCode: data.reason_code_description || null,
    },
    DTDC: {
      Status: data.trackDetails?.length
        ? data.trackDetails[data.trackDetails.length - 1].strCode
        : "N/A",
      StrRemarks: data.trackHeader?.strRemarks || "N/A",
      StatusLocation: data.trackDetails?.length
        ? data.trackDetails[data.trackDetails.length - 1].strOrigin
        : "N/A",
      StatusDateTime: data.trackDetails?.length
        ? formatDTDCDateTime(
            data.trackDetails[data.trackDetails.length - 1].strActionDate,
            data.trackDetails[data.trackDetails.length - 1].strActionTime
          )
        : null,
      Instructions: data.trackDetails?.length
        ? data.trackDetails[data.trackDetails.length - 1].strAction
        : "N/A",
    },

    Amazon: {
      Status: data.summary?.status || "N/A",
      StrRemarks:
        data.eventHistory?.length &&
        data.eventHistory[data.eventHistory.length - 1]?.shipmentType ===
          "FORWARD"
          ? data.summary?.trackingDetailCodes?.forward?.[0]
          : data.summary?.trackingDetailCodes?.reverse?.[1],
      StatusLocation: data.eventHistory?.length
        ? data.eventHistory[data.eventHistory.length - 1]?.location?.city
        : "N/A",
      StatusDateTime: data.eventHistory?.length
        ? formatAmazonDate(
            data.eventHistory[data.eventHistory.length - 1]?.eventTime
          )
        : "N/A",
      Instructions: data.eventHistory?.length
        ? data.eventHistory[data.eventHistory.length - 1]?.eventCode
        : "N/A",
      ShipmentType: data.eventHistory?.length
        ? data.eventHistory[data.eventHistory.length - 1]?.shipmentType
        : "N/A",
    },

    Shiprocket: {
      Status: data.current_status || null,
      StatusLocation: data.location || "Unknown",
      StatusDateTime: data.timestamp || null,
      Instructions: data.instructions || null,
    },
    NimbusPost: {
      Status: data.status || null,
      StatusCode: data.status_code || null,
      StatusLocation: data.city || "Unknown",
      StatusDateTime: data.updated_on || null,
      Instructions: data.remarks || null,
    },
    Delhivery: {
      Status: data.Status || "N/A",
      StatusType: data.StatusType || "N/A",
      StatusCode: data.StatusCode || null,
      StatusLocation: data.StatusLocation || "Unknown",
      StatusDateTime: data.StatusDateTime || null,
      Instructions: data.Instructions || null,
    },
    Xpressbees: {
      Status: data.tracking_status || null,
      StatusCode: data.status_code || null,
      StatusLocation: data.location || "Unknown",
      StatusDateTime: data.last_update || null,
      Instructions: data.remarks || null,
    },
    ShreeMaruti: {
      Status: data.status || null,
      StatusCode: data.status_code || null,
      StatusLocation: data.current_location || "Unknown",
      StatusDateTime: data.updated_at || null,
      Instructions: data.message || null,
    },
  };

  return providerMappings[provider] || null;
};

const formatDTDCDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr || dateStr.length !== 8 || timeStr.length !== 4) {
    return null; // Handle invalid inputs
  }

  try {
    // Extract date components
    const day = parseInt(dateStr.slice(0, 2));
    const month = parseInt(dateStr.slice(2, 4)) - 1; // JavaScript months are 0-based
    const year = parseInt(dateStr.slice(4, 8));

    // Extract time components
    const hours = parseInt(timeStr.slice(0, 2));
    const minutes = parseInt(timeStr.slice(2, 4));

    // Construct local (IST) date
    const date = new Date(year, month, day, hours, minutes);

    return date; // This will be in local system time (typically IST on Indian servers)
  } catch (err) {
    console.warn(`Invalid DTDC date/time format: ${dateStr} ${timeStr}`);
    return null;
  }
};

const formatAmazonDate = (isoDateStr) => {
  try {
    const d = new Date(isoDateStr);
    return d.toISOString(); // already UTC, just standardize
  } catch (err) {
    console.warn("Invalid Amazon date:", isoDateStr);
    return null;
  }
};

const formatSmartShipDateTime = (dateTimeStr) => {
  if (!dateTimeStr || typeof dateTimeStr !== "string") return null;

  try {
    // Input: "29-07-2025 23:01:06"
    const [datePart, timePart] = dateTimeStr.trim().split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Create a Date in UTC directly using Date.UTC
    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    );

    // Return ISO string without shifting (i.e., time stays 23:01:06)
    return utcDate.toISOString();
  } catch (err) {
    console.warn("Invalid SmartShip date format:", dateTimeStr);
    return null;
  }
};

const updateNdrHistoryByAwb = async (awb_number) => {
  try {
    const order = await Order.findOne({ awb_number });

    if (!order) {
      console.log(`❌ Order not found for AWB: ${awb_number}`);
      return;
    }

    // Get provider and corresponding status mapping
    const provider = order.provider?.toLowerCase();
    let statusMapping;

    switch (provider) {
      case "dtdc":
        statusMapping = DTDCStatusMapping;
        break;
      case "delhivery":
        statusMapping = DelhiveryStatusMapping;
        break;
      case "amazon":
        statusMapping = AmazonStatusMapping;
        break;
      case "smartship":
        statusMapping = SmartShipStatusMapping;
        break;
      default:
        console.log(
          `⚠️ No status mapping found for provider: ${order.provider}`
        );
        return;
    }

    const initialLength = order.ndrHistory.length;
    const statusKeys = Object.keys(statusMapping).map((s) => s.toLowerCase());

    // Filter out remarks that match any mapping key
    const filteredNdrHistory = order.ndrHistory.filter(
      (ndr) => !statusKeys.includes(ndr.remark?.toLowerCase())
    );

    if (filteredNdrHistory.length < initialLength) {
      // Renumber attempts sequentially
      const updatedNdrHistory = filteredNdrHistory.map((ndr, index) => ({
        ...ndr,
        attempt: index + 1,
      }));

      await Order.findOneAndUpdate(
        { awb_number },
        { $set: { ndrHistory: updatedNdrHistory } },
        { new: true } // optional: returns updated document
      );

      console.log(
        `✅ Updated order ${awb_number} — Removed ${
          initialLength - filteredNdrHistory.length
        } NDR entries`
      );
    } else {
      console.log(
        `ℹ️ No matching NDR remarks to remove for order ${awb_number}`
      );
    }
  } catch (error) {
    console.error("❌ Error updating order by AWB:", error);
  }
};

// Migration controller
const migrateNdrHistor = async (req, res) => {
  try {
    // Fetch all orders with old ndrHistory format
    const orders = await Order.find({
      status: { $nin: ["Delivered", "RTO Delivered", "new", "Cancelled"] },
    });

    for (const order of orders) {
      const newHistory = [];

      for (const oldEntry of order.ndrHistory) {
        let actionBy = "";
        let source = "";

        // Logic for actionBy & source
        if (oldEntry.action === "Auto Reattempt") {
          actionBy = order.courierServiceName || "Courier";
          source = order.provider || "Provider";
        } else if (oldEntry.action === "RE-ATTEMPT") {
          actionBy = "Shipex India";
          source = "Shipex India";
        }

        const newAction = {
          action: oldEntry.action,
          actionBy,
          remark: oldEntry.remark || "",
          source,
          date: oldEntry.date || new Date(),
        };

        // Place actions into groups of max 2
        const lastEntry = newHistory[newHistory.length - 1];
        if (lastEntry && lastEntry.actions.length < 2) {
          lastEntry.actions.push(newAction);
        } else if (newHistory.length < 3) {
          newHistory.push({ actions: [newAction] });
        }
      }

      // Ensure max 3 entries
      order.ndrHistory = newHistory.slice(0, 3);

      await order.save();
    }

    res.json({
      success: true,
      message: "NDR history migrated successfully",
    });
  } catch (err) {
    console.error("Migration error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const migrateNdrHistory = async (awbNumber) => {
  try {
    // const { awbNumber } = req.body; // 👈 pass awbNumber in request body
    console.log("Migrating AWB:", awbNumber);
    // Fetch single order with awbNumber and not in excluded statuses
    const order = await Order.findOne({
      awb_number: awbNumber,
      status: { $nin: ["Delivered", "RTO Delivered", "new", "Cancelled"] },
    });
    // console.log("order", order);

    if (!order) {
      return {
        success: false,
        message: "Order not found or already in excluded status",
      };
    }

    const newHistory = [];

    for (const oldEntry of order.ndrHistory) {
      let actionBy = "";
      let source = "";

      // Logic for actionBy & source
      if (oldEntry.action === "Auto Reattempt") {
        actionBy = order.courierServiceName || "Courier";
        source = order.provider || "Provider";
      } else if (oldEntry.action === "RE-ATTEMPT") {
        actionBy = "Shipex India";
        source = "Shipex India";
      }

      const newAction = {
        action: oldEntry.action,
        actionBy,
        remark: oldEntry.remark || "",
        source,
        date: oldEntry.date || new Date(),
      };

      // Place actions into groups of max 2
      const lastEntry = newHistory[newHistory.length - 1];
      if (lastEntry && lastEntry.actions.length < 2) {
        lastEntry.actions.push(newAction);
      } else if (newHistory.length < 3) {
        newHistory.push({ actions: [newAction] });
      }
    }

    // Ensure max 3 entries
    order.ndrHistory = newHistory.slice(0, 3);

    await order.save();

    return {
      success: true,
      message: "NDR history migrated successfully for the order",
      order, // 👈 return updated order so you can check
    };
  } catch (err) {
    console.error("Migration error:", err);
    return {
      success: false,
      error: err.message,
    };
  }
};

// migrateNdrHistory("77953338455")

// updateNdrHistoryByAwb("362413842319");

module.exports = { trackSingleOrder, startTrackingLoop };
