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
// const { date } = require("joi");
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
      error: error.message,
    });
  }
};

const codToBeRemitted = async () => {
  try {
    const deliveredCodOrders = await Order.find({
      status: "Delivered",
      "paymentDetails.method": "COD",
    });
    
    for (const order of deliveredCodOrders) {
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
        }
        await existingRemittance.save();
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
        await newRemittance.save();
      }
    }
    // console.log("000000000")
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
cron.schedule("1 1 * * *", () => {
  console.log("Running scheduled task at 1:01 AM: Fetching orders...");
  codToBeRemitted();
});
// cron.schedule("*/1 * * * *", () => {
//   console.log("Running scheduled task at 1 AM: Fetching orders...");
//   codToBeRemitted();
// });
// const data = async () => {
//   try {
//     await adminCodRemittance.deleteMany({ status: "Pending" });
//     console.log("Pending remittances deleted successfully.");
//   } catch (error) {
//     console.error("Error deleting pending remittances:", error);
//   }
// };
// data()
const remittanceScheduleData = async () => {
  try {
    const remittanceData = await codRemittance.find();
    const today = new Date();
    const isNotSunday = today.getDay() !== 0;
    const isTodayMWF = [1, 3, 5].includes(today.getDay());
    const isTodayTF = [2, 5].includes(today.getDay());

    for (const remittance of remittanceData) {
      const [codPlan, user, wallet] = await Promise.all([
        CodPlan.findOne({ user: remittance.userId }),
        User.findById(remittance.userId),
        Wallet.findOne({ _id: remittance.userId.Wallet }),
      ]);

      if (!codPlan || !codPlan.planName) {
        console.log(`No plan for user ${remittance.userId}. Assigning default D+7 plan.`);
        await new CodPlan({ user: remittance.userId, planName: "D+7" }).save();
        continue;
      }

      if (
        !remittance.sameDayDelhiveryOrders ||
        remittance.sameDayDelhiveryOrders.length === 0
      ) {
        console.log(`No delivery orders for user ${remittance.userId}`);
        continue;
      }

      if (!user) {
        console.log(`User not found: ${remittance.userId}`);
        continue;
      }

      if (!wallet) {
        console.log(`Wallet not found for user: ${remittance.userId}`);
        continue;
      }

      const planDays = parseInt(codPlan.planName.replace(/\D/g, ""), 10);
      const planCharges = codPlan.planCharges || 0;

      for (const order of remittance.sameDayDelhiveryOrders) {
        const deliveryDate = new Date(order.date);
        if (isNaN(deliveryDate)) {
          console.log(`Invalid delivery date:`, order);
          continue;
        }

        const dayDifference = Math.floor((today - deliveryDate) / (1000 * 60 * 60 * 24));
        if (dayDifference !== planDays) {
          console.log(`Day difference not matching plan for user ${remittance.userId}`);
          continue;
        }

        // Duplicate check for afterPlan
        if (!isTodayMWF) {
          const duplicateExists = await afterPlan.exists({
            userId: remittance.userId,
            "orderDetails.date": today,
            "orderDetails.orders": { $all: order.orders },
          });
          if (duplicateExists) {
            console.log(`Duplicate afterPlan entry for user: ${remittance.userId}`);
            continue;
          }
        }

        // Recharge logic
        let rechargeAmount = remittance.rechargeAmount || 0;
        let remainingRecharge = 0;
        let extraAmount = 0;

        if (rechargeAmount <= order.codcal) {
          remainingRecharge = order.codcal - rechargeAmount;
          extraAmount = rechargeAmount;
          rechargeAmount = 0;
        } else {
          rechargeAmount -= order.codcal;
          remainingRecharge = 0;
          extraAmount = order.codcal;
        }

        const codToBeDeducted = Math.min(remittance.CODToBeRemitted, remainingRecharge);
        if (codToBeDeducted <= 0 || remittance.CODToBeRemitted - codToBeDeducted < 0) {
          console.log(`Skipping to avoid negative COD for ${remittance._id}`);
          continue;
        }

        // Update remittance entry
        const updateResult = await codRemittance.updateOne(
          {
            _id: remittance._id,
            CODToBeRemitted: { $gte: codToBeDeducted },
            "sameDayDelhiveryOrders.date": deliveryDate.toISOString(),
          },
          {
            $inc: {
              CODToBeRemitted: -codToBeDeducted,
              RemittanceInitiated: order.codcal,
            },
            $set: { rechargeAmount },
            $pull: {
              sameDayDelhiveryOrders: { date: deliveryDate.toISOString() },
            },
          }
        );

        if (updateResult.modifiedCount === 0) {
          console.log(`Concurrent update or already processed: ${remittance._id}`);
          continue;
        }

        // Wallet update
        let afterWallet = wallet.balance;
        let creditedAmount = 0;
        let remainingExtraCodcal = remainingRecharge;

        if (wallet.balance < 0) {
          if (remainingRecharge >= Math.abs(wallet.balance)) {
            creditedAmount = Math.abs(wallet.balance);
            remainingExtraCodcal = remainingRecharge - creditedAmount;
            afterWallet = 0;
          } else {
            creditedAmount = remainingRecharge;
            remainingExtraCodcal = 0;
            afterWallet += remainingRecharge;
          }
        }

        await Wallet.updateOne({ _id: wallet._id }, { $set: { balance: afterWallet } });

        // Prepare remittance entry
        const charges = (remainingExtraCodcal * planCharges) / 100;
        const totalCod = remainingExtraCodcal - charges;
        const remitanceId = Math.floor(10000 + Math.random() * 90000);

        const remittanceEntry = {
          date: today,
          userId: remittance.userId,
          userName: user.fullname,
          remitanceId,
          totalCod: Number(totalCod.toFixed(2)),
          amountCreditedToWallet: extraAmount,
          adjustedAmount: creditedAmount,
          earlyCodCharges: Number(charges.toFixed(2)),
          status: totalCod === 0 ? "Paid" : "Pending",
          orderDetails: {
            date: today,
            codcal: remainingExtraCodcal,
            orders: order.orders,
          },
        };

        let newRemittance;
        if (isNotSunday) {
          if ([1, 4, 7].includes(planDays)) {
            newRemittance = new adminCodRemittance(remittanceEntry);
          } else if (planDays === 2 && isTodayMWF) {
            newRemittance = new adminCodRemittance(remittanceEntry);
          } else if (planDays === 3 && isTodayTF) {
            newRemittance = new adminCodRemittance(remittanceEntry);
          } else {
            newRemittance = new afterPlan(remittanceEntry);
          }
        } else {
          newRemittance = new afterPlan(remittanceEntry);
        }

        await newRemittance.save();
        console.log(`Remittance created for user ${remittance.userId}, ID: ${remitanceId}`);
      }
    }

    console.log("✅ Remittance schedule processing completed.");
  } catch (error) {
    console.error("❌ Error in remittance schedule:", error);
    throw new Error("Failed to process remittance schedule.");
  }
};


// cron.schedule("*/1 * * * *", () => {
//   console.log("Running scheduled task at 5 AM: Fetching orders...");
//   remittanceScheduleData();
// });
cron.schedule("20 1 * * *", () => {
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
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isNotSunday = day !== 0;
    const isTodayMWF = [1, 3, 5].includes(day); // Monday, Wednesday, Friday
    const isTodayTF = [2, 5].includes(day);     // Tuesday, Friday

    const afterCodPlans = await afterPlan.find();

    for (const plan of afterCodPlans) {
      const codPlan = await CodPlan.findOne({ user: plan.userId });
      if (!codPlan || !codPlan.planName) {
        console.log(`Skipping: No COD plan for user ${plan.userId}`);
        continue;
      }

      const planDays = parseInt(codPlan.planName.replace(/\D/g, ""), 10);
      let shouldMoveToAdmin = false;

      if (isNotSunday) {
        if ([1, 4, 7].includes(planDays)) {
          shouldMoveToAdmin = true;
        } else if (planDays === 2 && isTodayMWF) {
          shouldMoveToAdmin = true;
        } else if (planDays === 3 && isTodayTF) {
          shouldMoveToAdmin = true;
        }
      }

      if (shouldMoveToAdmin) {
        const newRemittance = new adminCodRemittance({
          date: today,
          userId: plan.userId,
          userName: plan.userName,
          remitanceId: plan.remitanceId,
          totalCod: plan.totalCod,
          amountCreditedToWallet: 0,
          adjustedAmount: plan.adjustedAmount,
          earlyCodCharges: plan.earlyCodCharges,
          status: plan.totalCod === 0 ? "Paid" : "Pending",
          orderDetails: {
            date: today,
            codcal: plan.orderDetails?.codcal || [],
            orders: plan.orderDetails?.orders || [],
          },
        });

        await newRemittance.save();
        await afterPlan.findByIdAndDelete(plan._id);

        console.log(`Moved to adminCodRemittance & deleted: ${plan.userId}`);
      } else {
        console.log(
          `Skipping user ${plan.userId}: today not valid for plan D+${planDays}`
        );
      }
    }
  } catch (error) {
    console.error("Error in fetchExtraData:", error.message);
  }
};

// cron.schedule("*/1 * * * *", () => {
//     console.log("Running scheduled task at 4 AM: Fetching orders...");
//     fetchExtraData();
//   });
cron.schedule("30 1 * * *", () => {
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

// const uploadCodRemittance = async (req, res) => {
//   try {
//     const userID = req.user._id;

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Save file metadata
//     const fileData = new File({
//       filename: req.file.filename,
//       date: new Date(),
//       status: "Processing",
//     });
//     await fileData.save();

//     // Determine file extension
//     const fileExtension = path.extname(req.file.originalname).toLowerCase();
//     let codRemittances = [];
//     // Parse file based on extension
//     if (fileExtension === ".csv") {
//       codRemittances = await parseCSV(req.file.path, fileData);
//     } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
//       codRemittances = await parseExcel(req.file.path);
//     } else {
//       return res.status(400).json({ error: "Unsupported file format" });
//     }

//     if (!codRemittances || codRemittances.length === 0) {
//       return res.status(400).json({
//         error: "The uploaded file is empty or contains invalid data",
//       });
//     }

//     for (const row of codRemittances) {
//       const remittance = await adminCodRemittance.findOne({
//         remitanceId: row["*RemittanceID"],
//       });

//       if (!remittance) {
//         return res.status(400).json({
//           error: `Remittance ID ${row["*RemittanceID"]} not found.`,
//         });
//       }

//       let userRemittance = await codRemittance.findOne({
//         userId: remittance.userId,
//       });

//       if (!userRemittance) {
//         console.log(
//           `No COD Remittance found for user ${userID}, creating a new one.`
//         );

//         userRemittance = new codRemittance({
//           userId: userID,
//           TotalCODRemitted: 0,
//           TotalDeductionfromCOD: 0,
//           RemittanceInitiated: 0,
//           remittanceData: [],
//         });

//         await userRemittance.save();
//       }

//       for (const item of remittance.orderDetails.orders) {
//         const order = await Order.findOne({ _id: item });

//         if (!order) {
//           console.log(`Order with ID ${item} not found.`);
//           continue;
//         }

//         const paymentAmount = Number(order?.paymentDetails?.amount || 0);

//         await CodRemittanceOrders.findOneAndUpdate(
//           { orderID: order.orderId },
//           { $set: { status: "Paid" } },
//         );

//         // Safely subtract from RemittanceInitiated
//         if (userRemittance.RemittanceInitiated >= paymentAmount) {
//           userRemittance.RemittanceInitiated -= paymentAmount;
//         } else {
//           console.warn(
//             `RemittanceInitiated (${userRemittance.RemittanceInitiated}) is less than paymentAmount (${paymentAmount}). Skipping deduction to avoid negative value.`
//           );
//         }
//       }

//       // Add to totals
//       userRemittance.TotalCODRemitted += Number(remittance.totalCod || 0);

//       userRemittance.TotalDeductionfromCOD +=
//         Number(remittance.amountCreditedToWallet || 0) +
//         Number(remittance.earlyCodCharges || 0) +
//         Number(remittance.adjustedAmount || 0);

//         const remitted = Number(userRemittance.TotalCODRemitted);
//         const deducted = Number(userRemittance.TotalDeductionfromCOD);

//         if (isNaN(remitted) || isNaN(deducted)) {
//           console.error("Invalid values detected:", {
//             TotalCODRemitted: userRemittance.TotalCODRemitted,
//             TotalDeductionfromCOD: userRemittance.TotalDeductionfromCOD,
//           });
//           return res.status(500).json({ error: "Invalid remittance values" });
//         }
//       userRemittance.remittanceData.push({
//         date: remittance.date,
//         remittanceId: remittance.remitanceId,
//         utr: row["*UTR"] || "N/A",
//         codAvailable: remittance.totalCod || 0,
//         amountCreditedToWallet: remittance.amountCreditedToWallet || 0,
//         earlyCodCharges: remittance.earlyCodCharges || 0,
//         adjustedAmount: remittance.adjustedAmount || 0,
//         remittanceMethod: "Bank Transaction",
//         status: "Paid",
//         orderDetails: {
//           date: remittance.orderDetails.date,
//           codcal: remittance.orderDetails.codcal,
//           orders: [...remittance.orderDetails.orders],
//         },
//       });

//       await userRemittance.save();

//       remittance.status = "Paid";
//       await remittance.save();
//     }

//     fs.unlink(req.file.path, (err) => {
//       if (err) {
//         console.error("Error deleting file:", err);
//       } else {
//         console.log("File deleted successfully:", req.file.path);
//       }
//     });

//     return res.status(200).json({
//       message: "COD Remittance uploaded successfully",
//       file: fileData,
//     });
//   } catch (error) {
//     console.error("Error in uploadCodRemittance:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while processing the file" });
//   }
// };
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

    if (!codRemittances || codRemittances.length === 0) {
      return res.status(400).json({
        error: "The uploaded file is empty or contains invalid data",
      });
    }

    for (const row of codRemittances) {
      const remittance = await adminCodRemittance.findOne({
        remitanceId: row["*RemittanceID"],
      });

      if (!remittance) {
        return res.status(400).json({
          error: `Remittance ID ${row["*RemittanceID"]} not found.`,
        });
      }

      let userRemittance = await codRemittance.findOne({
        userId: remittance.userId,
      });

      if (!userRemittance) {
        console.log(
          `No COD Remittance found for user ${remittance.userId}, creating a new one.`
        );

        userRemittance = new codRemittance({
          userId: remittance.userId, // ✅ Use remittance.userId (not req.user._id)
          TotalCODRemitted: 0,
          TotalDeductionfromCOD: 0,
          RemittanceInitiated: 0,
          remittanceData: [],
        });

        await userRemittance.save();
      }

      // Ensure numeric fields are initialized
      userRemittance.TotalCODRemitted ??= 0;
      userRemittance.TotalDeductionfromCOD ??= 0;
      userRemittance.RemittanceInitiated ??= 0;
      userRemittance.remittanceData ??= [];

      for (const item of remittance.orderDetails.orders) {
        const order = await Order.findOne({ _id: item });

        if (!order) {
          console.log(`Order with ID ${item} not found.`);
          continue;
        }

        const paymentAmount = Number(order?.paymentDetails?.amount || 0);

        await CodRemittanceOrders.findOneAndUpdate(
          { orderID: order.orderId },
          { $set: { status: "Paid" } }
        );

        // Safely subtract from RemittanceInitiated
        if (userRemittance.RemittanceInitiated >= paymentAmount) {
          userRemittance.RemittanceInitiated -= paymentAmount;
        } else {
          console.warn(
            `RemittanceInitiated (${userRemittance.RemittanceInitiated}) is less than paymentAmount (${paymentAmount}). Skipping deduction to avoid negative value.`
          );
        }
      }

      // Add to totals
      userRemittance.TotalCODRemitted += Number(remittance.totalCod || 0);

      userRemittance.TotalDeductionfromCOD +=
        Number(remittance.amountCreditedToWallet || 0) +
        Number(remittance.earlyCodCharges || 0) +
        Number(remittance.adjustedAmount || 0);

      // Final safety check before saving
      const remitted = Number(userRemittance.TotalCODRemitted);
      const deducted = Number(userRemittance.TotalDeductionfromCOD);

      if (isNaN(remitted) || isNaN(deducted)) {
        console.error("Invalid values detected:", {
          TotalCODRemitted: userRemittance.TotalCODRemitted,
          TotalDeductionfromCOD: userRemittance.TotalDeductionfromCOD,
        });
        return res.status(500).json({ error: "Invalid remittance values" });
      }

      userRemittance.remittanceData.push({
        date: remittance.date,
        remittanceId: remittance.remitanceId,
        utr: row["*UTR"] || "N/A",
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

      await userRemittance.save();

      remittance.status = "Paid";
      await remittance.save();
    }

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
    const user = req.isEmployee ? req.employee._id : req.user._id;
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
    const user = req.isEmployee ? req.employee._id : req.user._id;

    // Fetch all delivered COD orders
    const allDelhiveryOrders = await Order.find({ status: "Delivered" });
    const codFilterData = allDelhiveryOrders.filter(
      (item) => item.paymentDetails?.method === "COD"
    );

    let existingCodRemittance = await CodRemittanceOrders.findOne({
      userId: user,
    });

    // Process orders in parallel using Promise.all
    const insertedOrders = await Promise.all(
      codOrders.map(async (order) => {
        try {
          // Find user info
          const userInfo = await users.findById(order.userId);
          if (!userInfo) {
            console.warn(`User not found for order ID: ${order.orderId}`);
            return null;
          }

          // Check if already inserted
          const existing = await CodRemittanceOrders.findOne({
            orderID: order.orderId,
          });

          if (existing) {
            return null; // Skip if exists
          }

          const lastTrackingUpdate = order.tracking?.length
            ? order.tracking[order.tracking.length - 1]?.StatusDateTime
            : null;

          const newRemittanceOrder = new CodRemittanceOrders({
            Date: lastTrackingUpdate,
            orderID: order.orderId,
            userName: userInfo.fullname,
            PhoneNumber: userInfo.phoneNumber,
            Email: userInfo.email,
            courierProvider: order.courierServiceName || "N/A",
            AWB_Number: order.awb_number || "N/A",
            CODAmount: String(order.paymentDetails.amount || "0"),
            status: "Pending",
          });

          await newRemittanceOrder.save();
          // return newRemittanceOrder;
        } catch (err) {
          console.error(`Error processing order ID: ${order.orderId}`, err);
          return null;
        }
      })
    );

    // Filter out any null (skipped or failed)
    const successfulInsertions = insertedOrders.filter(
      (order) => order !== null
    );

    return res.status(200).json({
      success: true,
      message: `${successfulInsertions.length} COD remittance orders processed successfully.`,
      data: existings,
    });
  } catch (error) {
    console.error("Error processing COD remittance orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
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
      let userRemittance = await CourierCodRemittance.findOne({
        userId: userID,
      });

      // Ensure userRemittance exists
      if (!userRemittance) continue;

      // for (const item of userRemittance.CourierCodRemittanceData) {
      const orderIndex = userRemittance.CourierCodRemittanceData.findIndex(
        (data) => data.AwbNumber.toString() === row["*AWB Number"].toString()
      );
      if (
        userRemittance &&
        userRemittance.CourierCodRemittanceData[orderIndex].status === "Pending"
      ) {
        userRemittance.CourierCodRemittanceData[orderIndex].status = "Paid";

        // Ensure values are numbers before updating
        userRemittance.TransferredRemittance =
          (userRemittance.TransferredRemittance || 0) +
          (userRemittance.CourierCodRemittanceData[orderIndex].CODAmount || 0);
        userRemittance.TotalRemittanceDue =
          (userRemittance.TotalRemittanceDue || 0) -
          (userRemittance.CourierCodRemittanceData[orderIndex].CODAmount || 0);
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
    res
      .status(500)
      .json({ error: "An error occurred while processing the file" });
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
