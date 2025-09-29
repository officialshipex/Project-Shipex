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
const statusMap = require("../statusMap/StatusMap.model");

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
      "Shree Maruti": trackOrderShreeMaruti,
      ShreeMaruti: trackOrderShreeMaruti,
      DTDC: trackOrderDTDC,
      Dtdc: trackOrderDTDC, // optional: keep both keys if needed
      EcomExpress: shipmentTrackingforward,
      "Amazon Shipping": getShipmentTracking,
      Amazon: getShipmentTracking, // optional: keep both keys if needed
      Smartship: trackOrderSmartShip,
    };

    if (!trackingFunctions[provider]) {
      console.warn(`Unknown provider: ${provider} for Order ID: ${order._id}`);
      return;
    }

    const result = await trackingFunctions[provider](awb_number, shipment_id);
    //  console.log("result",result)
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
    if (provider === "Dtdc" || provider === "DTDC") {
      const statusDoc = await statusMap.findOne(
        { partnerName: provider.toUpperCase() },
        { data: 1 }
      );

      if (statusDoc) {
        // match by code (case-insensitive)
        // console.log("nor",normalizedData.Status)
        const dbMapping = statusDoc.data.find(
          (d) => d.code?.toLowerCase() === normalizedData.Status?.toLowerCase()
        );
        // console.log("db mapping dtdc",dbMapping)
        if (dbMapping) {
          console.log("maped dtdc status",dbMapping.sy_status)
          order.status = dbMapping.sy_status;
          // Only set ndrStatus for actual NDR-related states
          if (
            ["Our for Delivery", "RTO", "Undelivered"].includes(
              dbMapping.sy_status
            )
          ) {
            order.ndrStatus = dbMapping.sy_status;
          }
          if (
            (order.ndrStatus === "Undelivered" ||
              order.ndrStatus === "Out for Delivery" ||
              order.ndrStatus === "Action_Requested") &&
            dbMapping.code === "DLV"
          ) {
            if (order.ndrHistory.length > 0) {
              // Delivered but NDR was raised → mark both
              order.status = "Delivered";
              order.ndrStatus = "Delivered";
            } else {
              // Delivered without NDR → only order.status
              order.status = "Delivered";
            }
          }
          const trackingLength = order.tracking?.length || 0;
          const previousStatus =
            trackingLength >= 2
              ? order.tracking[trackingLength - 2]?.status
              : null;
          if (
            normalizedData.Instructions ===
              "Return as per client instruction." &&
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
            dbMapping.sy_status === "Undelivered" ||
            dbMapping.code === "RTONONDLV"
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
            const lastNdr = order.ndrHistory[order.ndrHistory.length - 1];
            const lastAction = lastNdr?.actions?.[lastNdr.actions.length - 1];

            const lastEntryDate = lastAction?.date
              ? new Date(lastAction.date).toDateString()
              : null;
            const currentStatusDate = new Date(
              normalizedData.StatusDateTime
            ).toDateString();

            if (
              (lastEntryDate !== currentStatusDate ||
                order.ndrHistory.length === 0) &&
              order.ndrHistory.length <= 2
            ) {
              const attemptCount = order.ndrHistory?.length + 1 || 0;
              if (dbMapping.sy_status === "Undelivered") {
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
        }
      }
    }
    if (provider === "Amazon Shipping" || provider === "Amazon") {
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

          const lastNdr = order.ndrHistory[order.ndrHistory.length - 1];
          const lastAction = lastNdr?.actions?.[lastNdr.actions.length - 1];

          const lastEntryDate = lastAction?.date
            ? new Date(lastAction.date).toDateString()
            : null;

          const currentStatusDate = new Date(
            normalizedData.StatusDateTime
          ).toDateString();

          if (
            (order.ndrHistory.length === 0 ||
              lastEntryDate !== currentStatusDate) &&
            order.ndrHistory.length <= 2
          ) {
            const attemptCount = order.ndrHistory?.length + 1 || 0;
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
      if (
        SmartShipStatusMapping[instruction] === "Undelivered" &&
        (normalizedData.Instructions === "CONSIGNEE REFUSED TO ACCEPT" ||
          normalizedData.Instructions ===
            "CONSIGNEE NOT AVAILABLE CANT DELIVER")
      ) {
        order.status = "Undelivered";

        updateNdrHistoryByAwb(order.awb_number);

        order.ndrReason = {
          date: normalizedData.StatusDateTime,
          reason: normalizedData.StrRemarks,
        };

        const lastNdr = order.ndrHistory[order.ndrHistory.length - 1];
        const lastAction = lastNdr?.actions?.[lastNdr.actions.length - 1];

        const lastEntryDate = lastAction?.date
          ? new Date(lastAction.date).toDateString()
          : null;

        const currentStatusDate = new Date(
          normalizedData.StatusDateTime
        ).toDateString();

        if (
          (order.ndrHistory.length === 0 ||
            lastEntryDate !== currentStatusDate) &&
          order.ndrHistory.length <= 2
        ) {
          order.ndrStatus = "Undelivered";
          const attemptCount = order.ndrHistory?.length + 1 || 0;
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
      console.log("norma", normalizedData);
      if (
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
          const attemptCount = order.ndrHistory?.length + 1 || 0;
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
    }
    if (provider === "Shree Maruti" || provider === "ShreeMaruti") {
      // console.log("ShreeMaruti normalizedData", normalizedData);
      if (normalizedData.ShipmentType === "forward") {
        if (
          normalizedData.Status === "ORDER_CONFIRMED" ||
          normalizedData.Status === "PICKUP_PENDING" ||
          normalizedData.Status === "READY_FOR_DISPATCH" ||
          normalizedData.Status === "NOT_PICKED_UP"
          // normalizedData.Status === "PICKUP_SCHEDULED"||
          // normalizedData.Status === "PICKUP_DONE"
        ) {
          order.status = "Ready To Ship";
        }

        if (normalizedData.Status === "IN_TRANSIT") {
          order.status = "In-transit";
        }

        if (normalizedData.Status === "OUT_FOR_DELIVERY") {
          order.status = "Out for Delivery";
          order.ndrStatus = "Out for Delivery";
        }

        if (normalizedData.Status === "DELIVERED") {
          order.status = "Delivered";
        }

        if (normalizedData.Status === "LOST") {
          order.status = "Lost";
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
          // updateNdrHistoryByAwb(order.awb_number);

          order.ndrReason = {
            date: normalizedData.StatusDateTime,
            reason: normalizedData.StrRemarks,
          };

          const lastNdr = order.ndrHistory[order.ndrHistory.length - 1];
          const lastAction = lastNdr?.actions?.[lastNdr.actions.length - 1];

          const lastEntryDate = lastAction?.date
            ? new Date(lastAction.date).toDateString()
            : null;

          const currentStatusDate = new Date(
            normalizedData.StatusDateTime
          ).toDateString();

          if (
            (order.ndrHistory.length === 0 ||
              lastEntryDate !== currentStatusDate) &&
            order.ndrHistory.length <= 2
          ) {
            const attemptCount = order.ndrHistory?.length + 1 || 0;
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
          normalizedData.Status === "RTO_INITIATED" &&
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

        if (normalizedData.Status === "RTO_DELIVERED") {
          order.status = "RTO Delivered";
          order.ndrStatus = "RTO Delivered";
        }
      }
    }
    if (provider === "Delhivery") {
      const statusDoc = await statusMap.findOne(
        { partnerName: provider.toUpperCase() }, // partnerName stored as uppercase
        { data: 1 }
      );
      // console.log("stat", normalizedData.StatusType, normalizedData.Status);
      if (statusDoc) {
        function normalizeString(str) {
          return str?.toLowerCase().replace(/\s+/g, "").trim();
        }

        const dbMapping = statusDoc?.data.find(
          (d) =>
            normalizeString(d?.scan_type) ===
              normalizeString(normalizedData?.StatusType) &&
            normalizeString(d?.scan) ===
              normalizeString(normalizedData?.Status) &&
            normalizeString(d?.instructions) ===
              normalizeString(normalizedData?.Instructions)
        );

        console.log(dbMapping?.sy_status);

        if (dbMapping) {
          console.log("maped delhivery status", dbMapping.sy_status);
          order.status = dbMapping.sy_status; // fallback if not mapped
          // order.ndrStatus=dbMapping.sy_status
          // Only set ndrStatus for actual NDR-related states
          if (
            ["Our for Delivery", "RTO", "Undelivered"].includes(
              dbMapping.sy_status
            )
          ) {
            order.ndrStatus = dbMapping.sy_status;
          }
        }
      }
      // const statusMap = {
      //   "UD:Manifested": { status: "Ready To Ship" },
      //   "UD:In Transit": { status: "In-transit" },
      //   "UD:Dispatched": {
      //     status: "Out for Delivery",
      //     ndrStatus: "Out for Delivery",
      //   },
      //   "RT:In Transit": {
      //     status: "RTO In-transit",
      //     ndrStatus: "RTO In-transit",
      //   },
      //   "DL:RTO": { status: "RTO Delivered", ndrStatus: "RTO Delivered" },
      //   "DL:Delivered": { status: "Delivered" },
      // };

      // const key = `${normalizedData.StatusType}:${normalizedData.Status}`;
      // const mapped = statusMap[key];

      // if (mapped) {
      //   order.status = mapped.status;
      //   if (mapped.ndrStatus) order.ndrStatus = mapped.ndrStatus;
      // } else if (
      //   normalizedData.StatusType === "UD" &&
      //   normalizedData.Status === "Pending" &&
      //   normalizedData.StatusCode === "ST-108"
      // ) {
      //   order.status = "RTO";
      // }

      if (
        (order.ndrStatus === "Undelivered" ||
          order.ndrStatus === "Out for Delivery" ||
          order.ndrStatus === "Action_Requested") &&
        normalizedData.Status === "Delivered"
      ) {
        if (order.ndrHistory.length > 0) {
          // NDR was raised → mark both as Delivered
          order.status = "Delivered";
          order.ndrStatus = "Delivered";
        } else {
          // No NDR raised → only status is Delivered
          order.status = "Delivered";
        }
      }
      // await order.save();
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

      const lastNdr = order.ndrHistory[order.ndrHistory.length - 1];
      const lastAction = lastNdr?.actions?.[lastNdr.actions.length - 1];

      const lastEntryDate = lastAction?.date
        ? new Date(lastAction.date).toDateString()
        : null;

      const currentStatusDate = new Date(
        normalizedData.StatusDateTime
      ).toDateString();

      if (
        (order.ndrHistory.length === 0 ||
          lastEntryDate !== currentStatusDate) &&
        order.ndrHistory.length <= 2
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
          const attemptCount = order.ndrHistory?.length + 1 || 0;
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
      // provider: "Smartship",
      // awb_number: "35973710033224",
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
  // console.log("Mapping data for provider:", data);
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
  if (provider === "Shree Maruti" || provider === "ShreeMaruti") {
    // console.log("ShreeMaruti data", data);
    const last = data[0];
    // console.log("ShreeMaruti last", last);
    return {
      Status: last?.category || null,
      StatusLocation: last?.location || "Unknown",
      StatusDateTime: last?.createdAt
        ? formatShreeMarutiDate(last.createdAt)
        : null,
      Instructions: last?.subcategory || null,
      ShipmentType: last?.movement_type || null,
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

    Dtdc: {
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

    "Amazon Shipping": {
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

const formatShreeMarutiDate = (isoDateStr) => {
  try {
    const date = new Date(isoDateStr);

    // Convert to IST first
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value;

    const year = get("year");
    const month = get("month");
    const day = get("day");
    const hour = get("hour");
    const minute = get("minute");
    const second = get("second");
    const millis = get("fractionalSecond") || "000";

    // ⚡️ Store IST time but with Z (UTC), so frontend shift works
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millis}Z`;
  } catch (err) {
    console.warn("Invalid date:", isoDateStr);
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

    const initialLength = order.ndrHistory.reduce(
      (sum, group) => sum + (group.actions?.length || 0),
      0
    );

    const statusKeys = Object.keys(statusMapping).map((s) => s.toLowerCase());

    // Go through groups and remove actions that match a statusKey
    const filteredNdrHistory = order.ndrHistory
      .map((group) => {
        const filteredActions = (group.actions || []).filter(
          (action) => !statusKeys.includes(action.remark?.toLowerCase())
        );
        return { ...group, actions: filteredActions };
      })
      .filter((group) => group.actions.length > 0); // remove empty groups

    const finalLength = filteredNdrHistory.reduce(
      (sum, group) => sum + (group.actions?.length || 0),
      0
    );

    if (finalLength < initialLength) {
      await Order.findOneAndUpdate(
        { awb_number },
        { $set: { ndrHistory: filteredNdrHistory } },
        { new: true }
      );

      console.log(
        `✅ Updated order ${awb_number} — Removed ${
          initialLength - finalLength
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

// updateNdrHistoryByAwb("362413842319");

module.exports = { trackSingleOrder, startTrackingLoop };
