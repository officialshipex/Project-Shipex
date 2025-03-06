const cron = require("node-cron");
const CodPlan = require("./codPan.model");
const codRemittance = require("./codRemittance.model");
const Order = require("../models/newOrder.model");
const adminCodRemittance = require("./adminCodRemittance.model");
const User = require("../models/User.model");
const Wallet = require("../models/wallet");
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

// const codToBeRemitted = async () => {
//     try {
//       const allOrders = await Order.find({});

//       // Filter orders where the last tracking status is "Delivered" and payment method is "COD"
//       const deliveredCODOrders = allOrders.filter((order) => {
//         const lastTracking = order.tracking?.[order.tracking.length - 1]; // Get last tracking entry
//         return lastTracking?.status === "Delivered" && order.paymentDetails.method === "COD";
//       });

//       for (const order of deliveredCODOrders) {
//         const existingRemittance = await codRemittance.findOne({ userId: order.userId });

//         console.log("Processing order:", order._id);

//         // Extract delivery date from tracking info
//         const latestTracking = order.tracking?.[order.tracking.length - 1];
//         const deliveryDate = latestTracking?.StatusDateTime;

//         if (!deliveryDate) {
//           console.log(`Skipping order ${order._id} - No delivery date found`);
//           continue; // Skip processing this order
//         }

//         const formattedDeliveryDate = new Date(deliveryDate).toDateString();

//         if (existingRemittance) {
//           // Ensure the sameDayDelhiveryOrders array exists
//           existingRemittance.sameDayDelhiveryOrders = existingRemittance.sameDayDelhiveryOrders || [];

//           // Check if the order is already added
//           const existingEntry = existingRemittance.sameDayDelhiveryOrders.find(
//             (entry) =>
//               new Date(entry.date).toDateString() === formattedDeliveryDate &&
//               entry.orders.includes(order._id)
//           );

//           if (!existingEntry) {
//             // Order is new, so update CODToBeRemitted and add to orders
//             existingRemittance.CODToBeRemitted =
//               (existingRemittance.CODToBeRemitted || 0) + order.paymentDetails.amount;

//             // Check if there's already an entry for the same delivery date
//             const dateEntry = existingRemittance.sameDayDelhiveryOrders.find(
//               (entry) => new Date(entry.date).toDateString() === formattedDeliveryDate
//             );

//             if (dateEntry) {
//               // Add order ID to existing entry
//               dateEntry.orders.push(order._id);
//             } else {
//               // Create a new entry for this delivery date
//               existingRemittance.sameDayDelhiveryOrders.push({
//                 date: new Date(deliveryDate),
//                 codca: (codcal|| 0) + order.paymentDetails.amount,
//                 orders: [order._id],
//               });
//             }

//             await existingRemittance.save();
//           }
//         } else {
//           // Create new remittance entry if not found
//           const newRemittance = new codRemittance({
//             userId: order.userId,
//             CODToBeRemitted: order.paymentDetails.amount,
//             delhiveryData: deliveryDate,
//             sameDayDelhiveryOrders: [
//               {
//                 date: new Date(deliveryDate),
//                 codca:order.paymentDetails.amount,
//                 orders: [order._id],
//               },
//             ],
//           });

//           await newRemittance.save();
//         }
//       }

//       return { success: true, message: "COD updated successfully" };
//     } catch (error) {
//       console.error("Error updating COD:", error);
//       return {
//         success: false,
//         message: "An error occurred while updating the COD Plan",
//         error: error.message,
//       };
//     }
//   };

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
        await existingRemittance.save();
      } else {
        const newRemittance = new codRemittance({
          userId: order.userId,
          CODToBeRemitted: order.paymentDetails.amount,
          delhiveryData: deliveryDate,
          sameDayDelhiveryOrders: [
            {
              date: new Date(deliveryDate),
              codcal: order.paymentDetails.amount,
              orders: [order._id],
            },
          ],
        });

        await newRemittance.save();
        console.log("33333333333", newRemittance);
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

// cron.schedule("*/1 * * * *", () => {
//   console.log("Running scheduled task: Fetching orders...");
//   codToBeRemitted();
// });

// const remittanceScheduleData = async () => {
//   try {
//     const remittanceData = await codRemittance.find();
//     const today = new Date();
//     const todayDate = today.getDate(); // Get today's day (DD)
//     const isTodayMWF = [1, 4, 5].includes(today.getDay());
//     let DigitNumber = 1000;
//     // console.log("Is today Monday, Wednesday, or Friday?", isTodayMWF);

//     for (const remittance of remittanceData) {
//       const codplans = await CodPlan.findOne({ user: remittance.userId });

//       if (!codplans || !codplans.planName) {
//         console.log(`No plan found for user: ${remittance.userId}`);
//         continue;
//       }

//       const planeDay = parseInt(codplans.planName.match(/\d+/)[0], 10);
//       const remitted = await codRemittance.findOne({
//         userId: remittance.userId,
//       });

//       if (!remitted || !remitted.sameDayDelhiveryOrders) {
//         console.log(`No remitted orders for user: ${remittance.userId}`);
//         continue;
//       }

//       remitted.sameDayDelhiveryOrders.map(async (value) => {
//         if (value.date) {
//           const deliveryDate = new Date(value.date);
//           const deliveryDay = deliveryDate.getDate();
//           const dayDifference = Math.floor(
//             (today - deliveryDate) / (1000 * 60 * 60 * 24)
//           );

//           if (dayDifference === 4) {
//             DigitNumber += 1;
//             if (isTodayMWF) {
//               const username = await User.findOne({ _id: remittance.userId });
//               const wallet = await Wallet.findOne({ _id: username.Wallet });
//               let afterWallet = wallet.balance; // Default to current balance
//               let extraCodcal=value.codcal;

//               if (wallet.balance < 0) {
//                 if (value.codcal >= Math.abs(wallet.balance)) {
//                   extraCodcal = value.codcal - Math.abs(wallet.balance); // Extra COD after clearing negative balance
//                   afterWallet = 0; // Wallet balance becomes 0 after adjustment
//                 } else {
//                   afterWallet = wallet.balance + value.codcal; // Reduce the negative balance
//                   extraCodcal = 0; // No extra COD left
//                 }
//               }

//               // Update wallet balance in the database
//               await Wallet.updateOne(
//                 { _id: username.Wallet },
//                 { $set: { balance: afterWallet } }
//               );

//               // console.log("Wallet balance updated successfully:", afterWallet);
//               // console.log("Extra COD available:", extraCodcal);

//               const chagersPercentage =
//                 (extraCodcal * codplans.planCharges) / 100;
//               const totalvalue = extraCodcal - chagersPercentage;
//               if (!adminCodRemittance.remitanceAdminData) {
//                 adminCodRemittance.remitanceAdminData = [];
//               }
//               await adminCodRemittance.remitanceAdminData.push({
//                 date: today,
//                 userId: remittance.userId,
//                 userName: username.fullname,
//                 remitanceId: DigitNumber,
//                 totalCod: totalvalue,
//                 earlyCodCharges: chagersPercentage,
//                 status: totalvalue === 0 ? "Paid" : "Pending",
//               });
//               await adminCodRemittance.save();
//             } 
            
//           }

//           console.log(`Day Difference: ${dayDifference}`);
//         } else {
//           console.log("Invalid date:", value);
//         }
//       });
//     }
//     console.log("jjjjj")
//   } catch (error) {
//     console.error("Error fetching remittance schedule data:", error);
//     throw new Error(
//       "Failed to retrieve remittance schedule data. Please try again later."
//     );
//   }
// };
const remittanceScheduleData = async () => {
  try {
    const remittanceData = await codRemittance.find();
    const today = new Date();
    const todayDate = today.getDate(); // Get today's day (DD)
    const isTodayMWF = [1, 4, 5].includes(today.getDay());
    let DigitNumber = 1000;

    for (const remittance of remittanceData) {
      const codplans = await CodPlan.findOne({ user: remittance.userId });

      if (!codplans || !codplans.planName) {
        console.log(`No plan found for user: ${remittance.userId}`);
        continue;
      }

      const planeDay = parseInt(codplans.planName.match(/\d+/)[0], 10);
      const remitted = await codRemittance.findOne({ userId: remittance.userId });

      if (!remitted || !remitted.sameDayDelhiveryOrders) {
        console.log(`No remitted orders for user: ${remittance.userId}`);
        continue;
      }

      for (const value of remitted.sameDayDelhiveryOrders) {
        if (value.date) {
          const deliveryDate = new Date(value.date);
          const dayDifference = Math.floor((today - deliveryDate) / (1000 * 60 * 60 * 24));

          if (dayDifference === 7 && isTodayMWF) {
            DigitNumber += 1;
            
            const username = await User.findOne({ _id: remittance.userId });
            const wallet = await Wallet.findOne({ _id: username.Wallet });

            let afterWallet = wallet.balance;
            let extraCodcal = value.codcal;

            if (wallet.balance < 0) {
              if (value.codcal >= Math.abs(wallet.balance)) {
                extraCodcal = value.codcal - Math.abs(wallet.balance);
                afterWallet = 0;
              } else {
                afterWallet = wallet.balance + value.codcal;
                extraCodcal = 0;
              }
            }

            await Wallet.updateOne({ _id: username.Wallet }, { $set: { balance: afterWallet } });

            const chagersPercentage = (extraCodcal * codplans.planCharges) / 100;
            const totalvalue = extraCodcal - chagersPercentage;

            // Ensure adminCodRemittance is fetched properly
            let adminCodRemittances = await adminCodRemittance.findOne({ userId: remittance.userId });

            if (!adminCodRemittances) {
              adminCodRemittances = new adminCodRemittance({ userId: remittance.userId, remitanceAdminData: [] });
            }

            adminCodRemittances.remitanceAdminData.push({
              date: today,
              userId: remittance.userId,
              userName: username.fullname,
              remitanceId: DigitNumber,
              totalCod: totalvalue,
              earlyCodCharges: chagersPercentage,
              status: totalvalue === 0 ? "Paid" : "Pending",
            });
            await adminCodRemittances.save();
          }
        } else {
          console.log("Invalid date:", value);
        }
      }
    }
    console.log("Remittance schedule processing completed.");
  } catch (error) {
    console.error("Error fetching remittance schedule data:", error);
    throw new Error("Failed to retrieve remittance schedule data. Please try again later.");
  }
};


// cron.schedule("*/1 * * * *", () => {
//   console.log("Running scheduled task: Fetching orders...");
//   remittanceScheduleData();
// });

const codRemittanceData = async (req, res) => {
  try {
    const userId = req.user._id;
    const existingRemittance = await codRemittance.findOne({ userId: userId });
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

// cron.schedule('* * * * *', () => {
//     const now = new Date();
//     const formattedDate = now.toLocaleString('en-US', {
//         weekday: 'long', // Shows full day name (e.g., Monday)
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     });

//     console.log(`Running a task every minute: ${formattedDate}`);
// });

module.exports = {
  codPlanUpdate,
  codToBeRemitted,
  codRemittanceData,
};
