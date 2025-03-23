const cron = require("node-cron");
const CodPlan = require("./codPan.model");
const codRemittance = require("./codRemittance.model");
const Order = require("../models/newOrder.model");
const adminCodRemittance = require("./adminCodRemittance.model");
const users = require("../models/User.model");
const Wallet = require("../models/wallet");
const afterPlan = require("./afterPlan.model");
const fs = require("fs");
const csvParser = require("csv-parser");
const User = require("../models/User.model.js");
const ExcelJS = require("exceljs");
const path = require("path");
const xlsx = require("xlsx");
const File = require("../model/bulkOrderFiles.model.js");
const { date } = require("joi");
const CourierCodRemittance = require("./CourierCodRemittance.js");
const CodRemittanceOrders = require("./CodRemittanceOrder.model.js");

const codPlanUpdate = async (req, res) => {
  try {
    const userID = req.user?._id; // Ensure req.user exists
    const { planName, codAmount } = req.body;

    // console.log("Request Body:", req.body); // Debugging log

    // Validate user authentication
    if (!userID) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Validate request body
    if (!planName || !codAmount) {
      return res.status(400).json({
        success: false,
        error: "Plan name and COD amount are required",
      });
    }

    // Find existing COD Plan for the user
    let codPlan = await CodPlan.findOne({ user: userID });

    if (codPlan) {
      // Update existing COD Plan
      codPlan.planName = planName;
      codPlan.planCharges = codAmount;
      await codPlan.save();

      return res.status(200).json({
        success: true,
        message: "COD Plan updated successfully",
        codPlan,
      });
    } else {
      // Create new COD Plan
      codPlan = new CodPlan({
        user: userID,
        planName,
        planCharges: codAmount,
      });
      await codPlan.save();

      return res.status(201).json({
        success: true,
        message: "New COD Plan created successfully",
        codPlan,
      });
    }
  } catch (error) {
    console.error("Error updating COD Plan:", error); // Log for debugging

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the COD Plan",
      error: error.message, // Send error details for debugging (optional)
    });
  }
};

const codToBeRemitted = async () => {
  try {
    const allOrders = await Order.find({});

    // Filter orders where the last tracking status is "Delivered" and payment method is "COD"
    const deliveredCODOrders = allOrders.filter((order) => {
      const lastTracking = order.tracking?.[order.tracking.length - 1]; // Get last tracking entry
      return (
        lastTracking?.status === "Delivered" &&
        order.paymentDetails.method === "COD"
      );
    });

    for (const order of deliveredCODOrders) {
      // console.log("8888888",order)
      const latestTracking = order.tracking?.[order.tracking.length - 1];
      const deliveryDate = latestTracking?.StatusDateTime;

      if (!deliveryDate) {
        console.log(`Skipping order ${order._id} - No delivery date found`);
        continue; // Skip processing this order
      }

      const formattedDeliveryDate = new Date(deliveryDate)
        .toISOString()
        .split("T")[0];

      // Check if remittance already exists for this user
      const existingRemittance = await codRemittance.findOne({
        userId: order.userId,
      });
// console.log("jkkkjjkjk",existingRemittance)
      if (existingRemittance) {
        let dateEntry = existingRemittance.sameDayDelhiveryOrders?.find(
          (entry) =>
            new Date(entry.date).toISOString().split("T")[0] ===
            formattedDeliveryDate
        );

        if (dateEntry) {
          if (!dateEntry.orders.includes(order._id)) {
            dateEntry.orders.push(order._id);
            dateEntry.codcal += order.paymentDetails.amount;
            existingRemittance.CODToBeRemitted += order.paymentDetails.amount;
          }
        } else {
          dateEntry = {
            date: new Date(deliveryDate),
            codcal: order.paymentDetails.amount,
            orders: [order._id],
          };
          existingRemittance.sameDayDelhiveryOrders.push(dateEntry);
          existingRemittance.CODToBeRemitted += order.paymentDetails.amount;
          // await existingRemittance.save();
        }
        // await existingRemittance.save();
      } else {
        const newRemittance = new codRemittance({
          userId: order.userId,
          CODToBeRemitted: order.paymentDetails.amount,
          rechargeAmount: 0,
          sameDayDelhiveryOrders: [
            {
              date: new Date(deliveryDate),
              codcal: order.paymentDetails.amount,
              orders: [order._id],
            },
          ],
        });

        // await newRemittance.save();
        // console.log("33333333333", newRemittance);
      }
    }

    return { success: true, message: "COD updated successfully" };
  } catch (error) {
    console.error("Error updating COD:", error);
    return {
      success: false,
      message: "An error occurred while updating the COD Plan",
      error: error.message,
    };
  }
};

cron.schedule("0 3 * * *", () => {
  console.log("Running scheduled task at 4 AM: Fetching orders...");
  codToBeRemitted();
});
// cron.schedule("*/1 * * * *", () => {
//   console.log("Running scheduled task at 6 AM: Fetching orders...");
//   codToBeRemitted();
// });

const remittanceScheduleData = async () => {
  try {
    const remittanceData = await codRemittance.find();
    const today = new Date();
    const isTodayMWF = [1, 3, 5].includes(today.getDay());

    for (const remittance of remittanceData) {
      const [codplans, remitted] = await Promise.all([
        CodPlan.findOne({ user: remittance.userId }),
        codRemittance.findOne({ userId: remittance.userId }),
      ]);

      if (!codplans || !codplans.planName) {
        console.log(
          `No plan found for user: ${remittance.userId}. Creating a new plan.`
        );

        const newPlan = new CodPlan({
          user: remittance.userId,
          planName: "D+7", // Default plan
        });

        await newPlan.save();
        continue; // Skip processing for this user in the current iteration
      }

      if (
        !remitted ||
        !Array.isArray(remitted.sameDayDelhiveryOrders) ||
        remitted.sameDayDelhiveryOrders.length === 0
      ) {
        console.log(`No remitted orders for user: ${remittance.userId}`);
        continue;
      }

      const Codplans = parseInt(codplans.planName.replace(/\D/g, ""), 10);

      for (const value of remitted.sameDayDelhiveryOrders) {
        if (!value.date || isNaN(new Date(value.date))) {
          console.log("Invalid date:", value);
          continue;
        }

        const deliveryDate = new Date(value.date);
        const dayDifference = Math.floor(
          (today - deliveryDate) / (1000 * 60 * 60 * 24)
        );

        const username = await User.findOne({ _id: remittance.userId });
        if (!username) {
          console.log(`User not found: ${remittance.userId}`);
          continue;
        }

        if (dayDifference === Codplans) {
        //
        // if (true) {
          // console.log("kkkkkkkkkkk", value);
          //if user recharge from cod amount
          let Recharge = remitted.rechargeAmount;
          let rechargeAmount = Recharge;
          console.log("Initial Recharge Amount:", rechargeAmount);

          let afterRecharge = 0;
          let extraAmount = 0;
          // console.log("fhfhhf", value.codcal);
          if (rechargeAmount <= value.codcal) {
            // Deduct recharge amount from codcal
            afterRecharge = value.codcal - rechargeAmount;
            extraAmount = rechargeAmount;
            rechargeAmount = 0;
          } else {
            // If rechargeAmount is greater, adjust rechargeAmount
            rechargeAmount = rechargeAmount - value.codcal;
            afterRecharge = 0;
            extraAmount = value.codcal;
          }
        
          let updateQuery = {
            $inc: {
              RemittanceInitiated: value.codcal, // Always update RemittanceInitiated
            },
            $set: { rechargeAmount: rechargeAmount },
          };
          
          // Only deduct from CODToBeRemitted if it's greater than 0
          if (remitted.CODToBeRemitted > 0) {
            updateQuery.$inc.CODToBeRemitted = -afterRecharge;
          }
          
          await codRemittance.updateOne({ _id: remitted._id }, updateQuery);
          
          
          if (!username.Wallet) {
            console.log(`User ${remittance.userId} has no associated Wallet`);
            continue;
          }

          const wallet = await Wallet.findOne({ _id: username.Wallet });
          if (!wallet) {
            console.log(`Wallet not found for user: ${remittance.userId}`);
            continue;
          }

          // Adjust wallet balance using extraCodcal
          let afterWallet = wallet.balance;
          let extraCodcal = afterRecharge || 0; // Ensure codcal is not undefined
          let creditedAmount = 0; // Amount used to adjust wallet
          let remainingExtraCodcal = extraCodcal; // Remaining extra amount

          if (wallet.balance < 0) {
            if (extraCodcal >= Math.abs(wallet.balance)) {
              creditedAmount = Math.abs(wallet.balance); // Use only the required amount
              remainingExtraCodcal = extraCodcal - creditedAmount; // Leftover extra amount
              afterWallet = 0; // Wallet is now zero
            } else {
              creditedAmount = extraCodcal; // Use whatever is available
              remainingExtraCodcal = 0; // No extra left after adjustment
              afterWallet += extraCodcal; // Reduce wallet's negative balance
            }
          }

          // Update wallet balance
          await Wallet.updateOne(
            { _id: username.Wallet },
            { $set: { balance: afterWallet } }
          );

          // Calculate charges and remaining COD amount
          const chargesPercentage =
            (remainingExtraCodcal * codplans.planCharges) / 100;
          const totalValue = remainingExtraCodcal - chargesPercentage;

          const remitanceId = Math.floor(10000 + Math.random() * 90000);
          let newRemittance;

          const remittanceDetails = {
            date: today,
            userId: remittance.userId,
            userName: username.fullname,
            remitanceId,
            totalCod: totalValue,
            amountCreditedToWallet: extraAmount,
            adjustedAmount: creditedAmount,
            earlyCodCharges: chargesPercentage,
            status: totalValue === 0 ? "Paid" : "Pending",
            orderDetails: {
              date: today,
              codcal: remainingExtraCodcal,
              orders: value.orders,
            },
          };

          if (isTodayMWF) {
            newRemittance = new adminCodRemittance(remittanceDetails);
          } else {
            newRemittance = new afterPlan(remittanceDetails);
          }
          await newRemittance.save();
          console.log(
            `Remittance created for user: ${remittance.userId}, ID: ${remitanceId}`
          );
        } else {
          console.log(
            `No remittance created for user: ${remittance.userId} (dayDifference: ${dayDifference})`
          );
        }
      }
    }

    console.log("Remittance schedule processing completed.");
  } catch (error) {
    console.error("Error fetching remittance schedule data:", error);
    throw new Error(
      "Failed to retrieve remittance schedule data. Please try again later."
    );
  }
};

// cron.schedule("*/1 * * * *", () => {
//   console.log("Running scheduled task at 5 AM: Fetching orders...");
//   remittanceScheduleData();
// });
cron.schedule("* 4 * * *", () => {
  console.log("Running scheduled task at 4 AM: Fetching orders...");
  remittanceScheduleData();
});

// cron.schedule("*/1 * * * *", () => {
//   console.log("Running scheduled task at 4 AM: Fetching orders...");
//   remittanceScheduleData();
// });
const fetchExtraData = async () => {
  try {
    const today = new Date();
    const isTodayMWF = [1, 3, 5].includes(today.getDay()); // Check if today is Monday, Wednesday, or Sunday
    // console.log(isTodayMWF)
    const afterCodPlans = await afterPlan.find();

    if (isTodayMWF) {
      console.log(isTodayMWF);
      for (const plans of afterCodPlans) {
        // console.log(plans)
        const newRemittance = new adminCodRemittance({
          date: today,
          userId: plans.userId,
          userName: plans.userName,
          remitanceId: plans.remitanceId,
          totalCod: plans.totalCod,
          amountCreditedToWallet: 0,
          adjustedAmount: plans.adjustedAmount,
          earlyCodCharges: plans.earlyCodCharges,
          status: plans.totalCod === 0 ? "Paid" : "Pending",
          orderDetails: {
            date: today,
            codcal: plans.orderDetails?.codcal || [], // Ensure valid property
            orders: plans.orderDetails?.orders || [], // Ensure valid property
          },
        });

        await newRemittance.save();

        // Delete existing plan after processing
        const deletedPlan = await afterPlan.findByIdAndDelete(plans._id);
        console.log("Deleted Plan:", deletedPlan);
      }
    }
  } catch (error) {
    console.error("Error fetching extra data:", error.message);
  }
};
// cron.schedule("*/1 * * * *", () => {
//     console.log("Running scheduled task at 4 AM: Fetching orders...");
//     remittanceScheduleData();
//   });
cron.schedule("30 4 * * *", () => {
  console.log("Running scheduled task at 4.30 AM: Fetching orders...");
  fetchExtraData();
});

const codRemittanceData = async (req, res) => {
  try {
    const userId = req.user._id;
    const existingRemittance = await codRemittance.findOne({ userId: userId });
    // console.log("mcmmcmc",existingRemittance)
    return res.status(200).json({
      success: true,
      message: "COD remittance data retrieved successfully",
      data: existingRemittance, // Uncomment this when you fetch actual data
    });
  } catch (error) {
    console.error("Error fetching COD remittance data:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving COD remittance data",
      error: error.message, // Send error details for debugging
    });
  }
};

const getCodRemitance = async (req, res) => {
  try {
    const user = req.user._id;
    const remittanceRecord = await codRemittance.findOne({ userId: user });

    if (!remittanceRecord) {
      return res
        .status(404)
        .json({ message: "No COD remittance record found." });
    }

    return res.status(200).json({
      remittance: remittanceRecord.CODToBeRemitted,
    });
  } catch (error) {
    console.error("Error fetching COD remittance:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve COD remittance data." });
  }
};

const codRemittanceRecharge = async (req, res) => {
  try {
    const user = req.user._id;
    const { amount, walletId } = req.body;
    const remittanceRecord = await codRemittance.findOne({ userId: user });
    const currentWallet = await Wallet.findOne({ _id: walletId });
    if (amount > remittanceRecord.CODToBeRemitted) {
      return res
        .status(404)
        .json({ message: "Insufficient Cod Remittance Amount" });
    }
    await remittanceRecord.updateOne({
      $inc: { CODToBeRemitted: -amount },
      $inc: { rechargeAmount: amount },
    });
    await currentWallet.updateOne({
      $inc: { balance: amount },
      $push: {
        transactions: {
          category: "credit",
          amount: amount, // Fixing incorrect reference
          balanceAfterTransaction: currentWallet.balance + amount,
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          description: `Recharge from COD Remitance`,
        },
      },
    });

    return res
      .status(200)
      .json({ message: "COD remittance recharge processed successfully." });
  } catch (error) {
    console.log("Error processing COD remittance recharge:", error);
    return res
      .status(500)
      .json({ message: "Failed to process COD remittance recharge." });
  }
};

const getAdminCodRemitanceData = async (req, res) => {
  try {
    const adminCodRemittances = await adminCodRemittance.find();
    // console.log("dhdhdh",adminCodRemittances)
    res.status(200).json(adminCodRemittances);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const downloadSampleExcel = async (req, res) => {
  try {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sample Bulk Order");

    // Define headers
    worksheet.columns = [
      { header: "*RemittanceID", key: "RemittanceID", width: 30 },
      { header: "*UTR", key: "UTR", width: 40 },
      // { header: "*CODAmount", key: "CODAmount", width: 40 },
    ];

    // Add a sample row with mandatory product 1 and optional products
    worksheet.addRow({
      RemittanceID: "57432",
      UTR: "PAY67890",
      // CODAmount: "1000",
    });

    // Format the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { bold: true }; // Make headers bold
    });

    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=sample.xlsx");

    // Write workbook to response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res
      .status(500)
      .json({ error: "Error generating Excel file", details: error.message });
  }
};

function parseCSV(filePath, fileData) {
  return new Promise((resolve, reject) => {
    const orders = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        // orders.push(row);
        try {
          const order = new bulkOrdersCSV({
            fileId: fileData._id,
            orderId: row["*Order Id"],
            orderDate: row["Order Date as dd-mm-yyyy hh:MM"] || null,
            channel: row["*Channel"],
            paymentMethod: row["*Payment Method(COD/Prepaid)"],
            customer: {
              firstName: row["*Customer First Name"],
              lastName: row["Customer Last Name"] || "",
              email: row["Email (Optional)"] || "",
              mobile: row["*Customer Mobile"],
              alternateMobile: row["Customer Alternate Mobile"] || "",
            },
            shippingAddress: {
              line1: row["*Shipping Address Line 1"],
              line2: row["Shipping Address Line 2"] || "",
              country: row["*Shipping Address Country"],
              state: row["*Shipping Address State"],
              city: row["*Shipping Address City"],
              postcode: row["*Shipping Address Postcode"],
            },
            billingAddress: {
              line1: row["Billing Address Line 1"] || "",
              line2: row["Billing Address Line 2"] || "",
              country: row["Billing Address Country"] || "",
              state: row["Billing Address State"] || "",
              city: row["Billing Address City"] || "",
              postcode: row["Billing Address Postcode"] || "",
            },
            orderDetails: {
              masterSKU: row["*Master SKU"],
              name: row["*Product Name"],
              quantity: parseInt(row["*Product Quantity"]) || 0,
              taxPercentage: parseFloat(row["Tax %"]),
              sellingPrice: parseFloat(
                row["*Selling Price(Per Unit Item, Inclusive of Tax)"]
              ),
              discount: parseFloat(row["Discount(Per Unit Item)"]) || 0,
              shippingCharges: parseFloat(
                row["Shipping Charges(Per Order)"] || 0
              ),
              codCharges: parseFloat(row["COD Charges(Per Order)"] || 0),
              giftWrapCharges: parseFloat(
                row["Gift Wrap Charges(Per Order)"] || 0
              ),
              totalDiscount: parseFloat(row["Total Discount (Per Order)"] || 0),
              dimensions: {
                length: parseFloat(row["*Length (cm)"]),
                breadth: parseFloat(row["*Breadth (cm)"]),
                height: parseFloat(row["*Height (cm)"]),
              },
              weight: parseFloat(row["*Weight Of Shipment(kg)"]),
            },
            sendNotification:
              row["Send Notification(True/False)"].toLowerCase() === "true",
            comment: row["Comment"] || "",
            hsnCode: row["HSN Code"] || "",
            locationId: row["Location Id"] || "",
            resellerName: row["Reseller Name"] || "",
            companyName: row["Company Name"] || "",
            latitude: parseFloat(row["latitude"] || 0),
            longitude: parseFloat(row["longitude"] || 0),
            verifiedOrder: row["Verified Order"] === "1",
            isDocuments: row["Is documents"] || "No",
            orderType: row["Order Type"] || "",
            orderTag: row["Order tag"] || "",
          });
          await order.save();
          console.log(`Imported order: ${order.orderId}`);
        } catch (error) {
          console.error(`Error importing order: ${row["*Order Id"]}`, error);
        }
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve(orders);
      })
      .on("error", (error) => {
        console.log("CSV Parsing error:", error);
        reject(error);
      });
  });
}

// Helper function to read Excel file (.xlsx, .xls)
function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data;
}

const uploadCodRemittance = async (req, res) => {
  try {
    const userID = req.user._id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save file metadata
    const fileData = new File({
      filename: req.file.filename,
      date: new Date(),
      status: "Processing",
    });
    await fileData.save();

    // Determine file extension
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let codRemittances = [];

    // Parse file based on extension
    if (fileExtension === ".csv") {
      codRemittances = await parseCSV(req.file.path, fileData);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      codRemittances = await parseExcel(req.file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    // Validation: Check if file contains data
    if (!codRemittances || codRemittances.length === 0) {
      return res
        .status(400)
        .json({ error: "The uploaded file is empty or contains invalid data" });
    }

    // Process each remittance row
    for (const row of codRemittances) {
      const remittance = await adminCodRemittance.findOne({
        remitanceId: row["*RemittanceID"],
      });
      // console.log()

      if (!remittance) {
        return res.status(400).json({
          error: `Remittance ID ${row["*RemittanceID"]} not found.`,
        });
      }

      let userRemittance = await codRemittance.findOne({
        userId: remittance.userId,
      });

      // FIX: Handle missing userRemittance by creating a new record
      if (!userRemittance) {
        console.log(
          `No COD Remittance found for user ${userID}, creating a new one.`
        );

        userRemittance = new codRemittance({
          userId: userID,
          TotalCODRemitted: 0,
          TotalDeductionfromCOD: 0,
          remittanceData: [],
        });

        await userRemittance.save(); // Save the new document
      }

      for (const item of remittance.orderDetails.orders) {
        const order = await Order.findOne({ _id: item });

        if (!order) {
          console.log(`Order with ID ${item} not found.`);
          continue;
        }

        let existingCodRemittance = await CodRemittanceOrders.findOne({
          userId: userID,
        });

        if (!existingCodRemittance) {
          console.log(`No COD Remittance found for user ${userID}`);
          continue;
        }

        // Find order in the existing COD Remittance data
        const orderIndex =
          existingCodRemittance.codRemittanceOrderData.findIndex(
            (data) => data.orderID.toString() === order.orderId.toString()
          );

        if (orderIndex !== -1) {
          // Update status only if it is currently "Pending"
          if (
            existingCodRemittance.codRemittanceOrderData[orderIndex].status ===
            "Pending"
          ) {
            existingCodRemittance.codRemittanceOrderData[orderIndex].status =
              "Paid";

            const paymentAmount = Number(order?.paymentDetails?.amount) || 0;

            existingCodRemittance.totalCodRemittanceDue =
              Number(existingCodRemittance.totalCodRemittanceDue || 0) -
              paymentAmount;

            existingCodRemittance.totalCodRemittancePaid =
              Number(existingCodRemittance.totalCodRemittancePaid || 0) +
              paymentAmount;

            // Validate before saving
            if (isNaN(existingCodRemittance.totalCodRemittancePaid)) {
              console.error(
                "Invalid totalCodRemittancePaid:",
                existingCodRemittance.totalCodRemittancePaid
              );
              return res
                .status(500)
                .json({ error: "Invalid remittance amount" });
            }

            // Save the updated document
            await existingCodRemittance.save();
          }
        }
      }

      // Ensure values are properly initialized and avoid NaN
      userRemittance.TotalCODRemitted =
        Number(userRemittance.TotalCODRemitted || 0) +
        Number(remittance.totalCod || 0);

      userRemittance.TotalDeductionfromCOD =
        Number(userRemittance.TotalDeductionfromCOD || 0) +
        Number(remittance.amountCreditedToWallet || 0) +
        Number(remittance.earlyCodCharges || 0) +
        Number(remittance.adjustedAmount || 0);

      // Debugging - Ensure values are numbers
      if (
        isNaN(userRemittance.TotalCODRemitted) ||
        isNaN(userRemittance.TotalDeductionfromCOD)
      ) {
        console.error("Invalid values detected:", {
          TotalCODRemitted: userRemittance.TotalCODRemitted,
          TotalDeductionfromCOD: userRemittance.TotalDeductionfromCOD,
        });
        return res.status(500).json({ error: "Invalid remittance values" });
      }

      // Add remittance data
      userRemittance.remittanceData.push({
        date: remittance.date,
        remittanceId: remittance.remitanceId,
        utr: row["*UTR"] || "N/A", // Use default if UTR is missing
        codAvailable: remittance.totalCod || 0,
        amountCreditedToWallet: remittance.amountCreditedToWallet || 0,
        earlyCodCharges: remittance.earlyCodCharges || 0,
        adjustedAmount: remittance.adjustedAmount || 0,
        remittanceMethod: "Bank Transaction",
        status: "Paid",
        orderDetails: {
          date: remittance.orderDetails.date,
          codcal: remittance.orderDetails.codcal,
          orders: [...remittance.orderDetails.orders],
        },
      });

      // Save the updated userRemittance document
      await userRemittance.save();

      remittance.status = "Paid";
      await remittance.save();
    }

    // **Delete the uploaded file after processing**
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully:", req.file.path);
      }
    });

    return res.status(200).json({
      message: "COD Remittance uploaded successfully",
      file: fileData,
    });
  } catch (error) {
    console.error("Error in uploadCodRemittance:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the file" });
  }
};

const CheckCodplan = async (req, res) => {
  try {
    const userId = req.user?._id; // Ensure req.user exists
    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    const codplans = await CodPlan.findOne({ user: userId });
    const codplaneName = codplans.planName;
    // console.log("ffff",codplaneName)
    // console.log("kkdkdkd",codplans)
    res
      .status(200)
      .json({ message: "User ID retrieved successfully", codplaneName });
  } catch (error) {
    console.error("Error in checkCodPlan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const remittanceTransactionData = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user._id;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch remittance data for the user
    const remittanceData = await codRemittance.findOne({ userId: userID });

    if (!remittanceData) {
      return res.status(404).json({ error: "Remittance data not found." });
    }
    // Find the specific remittance transaction
    const result = remittanceData.remittanceData.find(
      (item) => item.remittanceId == id
    );

    if (!result) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    // Fetch all orders concurrently using Promise.all()
    const orderdata = await Promise.all(
      result.orderDetails.orders.map(async (item) => {
        return await Order.findOne({ _id: item });
      })
    );

    // Construct the response object
    const transactions = {
      remitanceId: id,
      date: result.date,
      totalOrder: result.orderDetails.orders.length,
      remitanceAmount: result.codAvailable,
      deliveryData: result.orderDetails.date,
      orderDataInArray: orderdata,
    };

    return res.status(200).json({
      success: true,
      message: "Remittance transaction data retrieved successfully.",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching remittance transactions:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving transaction data.",
      error: error.message,
    });
  }
};

const courierCodRemittance = async (req, res) => {
  try {
    const user = req.user._id;
    let existingCourierCodRemittance;
    // Fetch all delivered COD orders
    const allDelhiveryOrders = await Order.find({ status: "Delivered" });
    const codFilterData = allDelhiveryOrders.filter(
      (item) => item.paymentDetails.method === "COD"
    );

    for (const e of codFilterData) {
      // Fetch the user's full name
      const userNames = await users.findOne({ _id: e.userId });

      if (!userNames) {
        console.log(`User not found for order ${e.orderId}`);
        continue; // Skip this order if the user is not found
      }
      //  console.log("klkl",e)
      // console.log("User Name:", userNames.fullname);

      existingCourierCodRemittance = await CourierCodRemittance.findOne({
        userId: user,
      });

      const lastTrackingUpdate =
        e.tracking?.length > 0
          ? e.tracking[e.tracking.length - 1]?.StatusDateTime
          : "N/A";

      if (existingCourierCodRemittance) {
        // Check if the order already exists
        const orderExists =
          existingCourierCodRemittance.CourierCodRemittanceData.some(
            (order) => String(order.orderID).trim() === String(e.orderId).trim()
          );

        if (!orderExists) {
          // Update remittance only if order is new
          existingCourierCodRemittance.TotalRemittance +=
            e.paymentDetails.amount;
          existingCourierCodRemittance.TotalRemittanceDue +=
            e.paymentDetails.amount;

          // Push new order data
          existingCourierCodRemittance.CourierCodRemittanceData.push({
            date: lastTrackingUpdate,
            orderID: e.orderId,
            userName: userNames.fullname,
            PhoneNumber: userNames.phoneNumber,
            Email: userNames.email,
            courierProvider: e.courierServiceName,
            AwbNumber: e.awb_number || "N/A",
            CODAmount: e.paymentDetails.amount,
            status: "Pending",
          });

          await existingCourierCodRemittance.save();
        }
      } else {
        // If no remittance exists, create a new one
        const newRemittance = new CourierCodRemittance({
          userId: user,
          TotalRemittance: e.paymentDetails.amount,
          TransferredRemittance: 0,
          TotalRemittanceDue: e.paymentDetails.amount,
          CourierCodRemittanceData: [
            {
              date: lastTrackingUpdate,
              orderID: e.orderId,
              userName: userNames.fullname,
              PhoneNumber: userNames.phoneNumber,
              Email: userNames.email,
              CODAmount: e.paymentDetails.amount,
              courierProvider: e.courierServiceName, // Now `userNames` is always defined
              AwbNumber: e.awb_number || "N/A",
              CODAmount: e.paymentDetails.amount,
              status: "Pending",
            },
          ],
        });

        await newRemittance.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Courier COD remittance processed successfully.",
      data: existingCourierCodRemittance,
    });
  } catch (error) {
    console.error("Error processing COD remittance:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const CodRemittanceOrder = async (req, res) => {
  try {
    const user = req.user._id;

    // Fetch all delivered COD orders
    const allDelhiveryOrders = await Order.find({ status: "Delivered" });
    const codFilterData = allDelhiveryOrders.filter(
      (item) => item.paymentDetails?.method === "COD"
    );

    let existingCodRemittance = await CodRemittanceOrders.findOne({
      userId: user,
    });

    for (const e of codFilterData) {
      // Fetch the user's full name
      const userNames = await users.findOne({ _id: e.userId });
      if (!userNames) {
        console.log(`User not found for order ${e.orderId}`);
        continue; // Skip this order if the user is not found
      }

      // Get last tracking update safely
      const lastTrackingUpdate =
        e.tracking?.length > 0
          ? e.tracking[e.tracking.length - 1]?.StatusDateTime
          : "N/A";

      if (existingCodRemittance) {
        // Ensure CourierCodRemittanceData is an array before calling .some()
        if (!Array.isArray(existingCodRemittance.codRemittanceOrderData)) {
          existingCodRemittance.codRemittanceOrderData = [];
        }

        // Check if the order already exists
        const orderExists = existingCodRemittance.codRemittanceOrderData.some(
          (order) => String(order.orderID).trim() === String(e.orderId).trim()
        );

        if (!orderExists) {
          // Update remittance only if order is new
          existingCodRemittance.totalCodRemittance += e.paymentDetails.amount;
          existingCodRemittance.totalCodRemittanceDue +=
            e.paymentDetails.amount;

          // Push new order data
          existingCodRemittance.codRemittanceOrderData.push({
            Date: lastTrackingUpdate,
            orderID: e.orderId,
            courierProvider: e.courierServiceName,
            userName: userNames.fullname,
            PhoneNumber: userNames.phoneNumber,
            Email: userNames.email,
            AWB_Number: e.awb_number || "N/A",
            CODAmount: e.paymentDetails.amount,
            status: "Pending",
          });

          await existingCodRemittance.save();
        }
      } else {
        // If no remittance exists, create a new one
        existingCodRemittance = new CodRemittanceOrders({
          userId: user,
          totalCodRemittance: e.paymentDetails.amount,
          transferredCodRemittance: 0,
          totalCodRemittanceDue: e.paymentDetails.amount,
          codRemittanceOrderData: [
            {
              Date: lastTrackingUpdate,
              orderID: e.orderId,
              courierProvider: e.courierServiceName,
              userName: userNames.fullname,
              PhoneNumber: userNames.phoneNumber,
              Email: userNames.email,
              AWB_Number: e.awb_number || "N/A",
              CODAmount: e.paymentDetails.amount,
              status: "Pending",
            },
          ],
        });

        await existingCodRemittance.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Courier COD remittance processed successfully.",
      data: existingCodRemittance || [],
    });
  } catch (error) {
    console.error("Error processing COD remittance:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const sellerremittanceTransactionData = async (req, res) => {
  try {
    const { id } = req.params; // Remittance ID
    const userID = req.user?._id; // Ensure userID is available

    if (!userID) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (!id) {
      return res.status(400).json({ error: "Remittance ID is required." });
    }

    // Fetch remittance data for the specific Remittance ID
    const remittanceData = await adminCodRemittance.findOne({
      remitanceId: id,
    });
    // console.log("klklkllk",remittanceData)
    if (!remittanceData) {
      return res.status(404).json({ error: "Remittance data not found." });
    }

    // Ensure `orderDetails` exists before accessing `orders`
    const orderIds = remittanceData.orderDetails?.orders || [];

    // Fetch all orders concurrently using Promise.all()
    const orderdata = await Promise.all(
      orderIds.map(async (orderId) => {
        return orderId ? await Order.findById(orderId) : null;
      })
    );

    // Remove null values if any orders were not found
    const filteredOrders = orderdata.filter((order) => order !== null);

    // Construct the response object
    const transactions = {
      remitanceId: id,
      date: remittanceData.date || "N/A", // Ensure `date` exists
      totalOrder: filteredOrders.length,
      totalCOD: remittanceData.orderDetails.codcal,
      remitanceAmount: remittanceData.codAvailable || 0,
      deliveryDate: remittanceData.orderDetails?.date || "N/A", // Ensure `orderDetails` exists
      orderDataInArray: filteredOrders,
      status: remittanceData.status,
    };
    return res.status(200).json({
      success: true,
      message: "Remittance transaction data retrieved successfully.",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching remittance transactions:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving transaction data.",
      error: error.message,
    });
  }
};

const CourierdownloadSampleExcel = async (req, res) => {
  try {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sample Bulk Order");

    // Define headers
    worksheet.columns = [
      { header: "*AWB Number", key: "AWBNumber", width: 30 },
      { header: "*COD Amount", key: "CODAmount", width: 40 },
      // { header: "*CODAmount", key: "CODAmount", width: 40 },
    ];

    // Add a sample row with mandatory product 1 and optional products
    worksheet.addRow({
      AWBNumber: "5743267565",
      CODAmount: "500",
      // CODAmount: "1000",
    });

    // Format the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { bold: true }; // Make headers bold
    });

    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=sample.xlsx");

    // Write workbook to response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res
      .status(500)
      .json({ error: "Error generating Excel file", details: error.message });
  }
};
const uploadCourierCodRemittance = async (req, res) => {
  try {
    const userID = req.user._id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save file metadata
    const fileData = new File({
      filename: req.file.filename,
      date: new Date(),
      status: "Processing",
    });
    await fileData.save();

    // Determine file extension
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let codRemittances = [];

    // Parse file based on extension
    if (fileExtension === ".csv") {
      codRemittances = await parseCSV(req.file.path, fileData);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      codRemittances = await parseExcel(req.file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    // Validation: Check if file contains data
    if (!codRemittances || codRemittances.length === 0) {
      return res.status(400).json({
        error: "The uploaded file is empty or contains invalid data",
      });
    }

    // Process each remittance row
    for (const row of codRemittances) {
      let userRemittance = await CourierCodRemittance.findOne({ userId: userID });

      // Ensure userRemittance exists
      if (!userRemittance) continue;

      // for (const item of userRemittance.CourierCodRemittanceData) {
      const orderIndex =
          userRemittance.CourierCodRemittanceData.findIndex(
            (data) => data.AwbNumber.toString() === row["*AWB Number"].toString()
          );
        if (userRemittance && userRemittance.CourierCodRemittanceData[orderIndex].status === "Pending") {
          userRemittance.CourierCodRemittanceData[orderIndex].status= "Paid";

          // Ensure values are numbers before updating
          userRemittance.TransferredRemittance =
            (userRemittance.TransferredRemittance || 0) + (userRemittance.CourierCodRemittanceData[orderIndex].CODAmount || 0);
          userRemittance.TotalRemittanceDue =
            (userRemittance.TotalRemittanceDue || 0) - (userRemittance.CourierCodRemittanceData[orderIndex].CODAmount || 0);
          await userRemittance.save();
        }
      }

    // }

    // **Delete the uploaded file after processing**
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully:", req.file.path);
      }
    });

    return res.status(200).json({
      message: "Courier COD uploaded successfully",
      file: fileData,
    });
  } catch (error) {
    console.error("Error in uploadCodRemittance:", error);
    res.status(500).json({ error: "An error occurred while processing the file" });
  }
};

module.exports = {
  codPlanUpdate,
  codToBeRemitted,
  codRemittanceData,
  getCodRemitance,
  codRemittanceRecharge,
  getAdminCodRemitanceData,
  downloadSampleExcel,
  uploadCodRemittance,
  CheckCodplan,
  remittanceTransactionData,
  courierCodRemittance,
  CodRemittanceOrder,
  sellerremittanceTransactionData,
  CourierdownloadSampleExcel,
  uploadCourierCodRemittance,
};
