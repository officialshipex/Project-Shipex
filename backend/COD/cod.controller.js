const mongoose = require("mongoose");
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
const AllocateRole = require("../models/allocateRoleSchema");

// const { date } = require("joi");
const CourierCodRemittance = require("./CourierCodRemittance.js");
const CodRemittanceOrdersModel = require("./CodRemittanceOrder.model.js");
const SameDateDelivered = require("./samedateDelivery.model.js");
const BankAccountDetails = require("../models/BankAccount.model.js");
const codPlanUpdate = async (req, res) => {
  try {
    const { id } = req.query;
    const userID = id || req.user?._id; // Ensure req.user exists
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

const codToBeRemitteds = async () => {
  try {
    const deliveredCodOrders = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          "paymentDetails.method": "COD",
        },
      },
    ]);

    for (const order of deliveredCodOrders) {
      const latestTracking = order.tracking?.[order.tracking.length - 1];
      const deliveryDate = latestTracking?.StatusDateTime;

      if (!deliveryDate) {
        console.log(`⚠️ Skipping order ${order._id} - No delivery date`);
        continue;
      }

      const formattedDate = new Date(deliveryDate).toISOString().split("T")[0];
      const startOfDay = new Date(`${formattedDate}T00:00:00.000Z`);
      const endOfDay = new Date(`${formattedDate}T23:59:59.999Z`);

      const codAmount = order.paymentDetails.amount || 0;
      const customOrderId = order.orderId || "";

      // 🔍 Find SameDateDelivered for user and deliveryDate
      let sameDateEntry = await SameDateDelivered.findOne({
        userId: order.userId,
        deliveryDate: { $gte: startOfDay, $lte: endOfDay },
      });

      if (sameDateEntry) {
        // ✅ Check if order already exists
        const isDuplicate = sameDateEntry.orderDetails.some(
          (id) => Number(id.customOrderId) === order.orderId
        );

        if (!isDuplicate) {
          // ✅ Add to existing entry
          sameDateEntry.orderDetails.push({
            orderId: order._id,
            codAmount,
            customOrderId,
          });
          sameDateEntry.orderIds.push(order._id);
          sameDateEntry.totalCod += codAmount;
          await sameDateEntry.save();

          // ✅ Update or create remittance
          let remittance = await codRemittance.findOne({
            userId: order.userId,
          });
          if (!remittance) {
            remittance = new codRemittance({
              userId: order.userId,
              CODToBeRemitted: codAmount,
              rechargeAmount: 0,
            });
          } else {
            remittance.CODToBeRemitted += codAmount;
          }
          await remittance.save();
        }
      } else {
        // ✅ Create new SameDateDelivered entry
        await SameDateDelivered.create({
          userId: order.userId,
          deliveryDate: new Date(deliveryDate),
          orderDetails: [
            {
              orderId: order._id,
              codAmount,
              customOrderId,
            },
          ],
          orderIds: [order._id],
          totalCod: codAmount,
          status: "Pending",
        });

        // ✅ Create or update remittance
        let remittance = await codRemittance.findOne({ userId: order.userId });
        if (!remittance) {
          remittance = new codRemittance({
            userId: order.userId,
            CODToBeRemitted: codAmount,
            rechargeAmount: 0,
          });
        } else {
          remittance.CODToBeRemitted += codAmount;
        }
        await remittance.save();
      }
    }
  } catch (error) {
    console.error("❌ Error in COD to be remitted:", error);
  }
};
cron.schedule("1 1 * * *", () => {
  console.log("Running scheduled task at 1:01 AM: Fetching orders...");
  codToBeRemitteds();
});
// codToBeRemitteds();

const remittanceScheduleData = async () => {
  try {
    const existingSameDateDelivered = await SameDateDelivered.find({
      status: "Pending",
    });

    const today = new Date();
    // const todayStr = today.toISOString().split("T")[0];

    const isNotSunday = today.getDay() !== 0;
    const isTodayMWF = [1, 3, 5].includes(today.getDay());
    const isTodayTF = [2, 5].includes(today.getDay());

    for (const remittance of existingSameDateDelivered) {
      const [codPlan, user] = await Promise.all([
        CodPlan.findOne({ user: remittance.userId }),
        User.findById(remittance.userId),
      ]);

      if (!codPlan || !codPlan.planName) {
        console.log(
          `No plan for user ${remittance.userId}. Assigning default D+7 plan.`
        );
        await new CodPlan({ user: remittance.userId, planName: "D+7" }).save();
        continue;
      }
      // console.log("codPlan", codPlan);
      const planDays = parseInt(codPlan.planName.replace(/\D/g, ""), 10);
      const planCharges = codPlan.planCharges || 0;

      const startOfTodayUTC = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        )
      );
      const deliveryUTC = new Date(
        Date.UTC(
          remittance.deliveryDate.getUTCFullYear(),
          remittance.deliveryDate.getUTCMonth(),
          remittance.deliveryDate.getUTCDate()
        )
      );
      const dayDiff = Math.floor(
        (startOfTodayUTC - deliveryUTC) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff >= planDays) {
        if (!user) {
          console.log(`User not found: ${remittance.userId}`);
          continue;
        }

        const wallet = await Wallet.findById(user.Wallet);
        if (!wallet) {
          console.log(`Wallet not found for user: ${remittance.userId}`);
          continue;
        }

        const orders = remittance.orderIds || [];
        if (orders.length === 0) {
          console.log(`No delivery orders for user ${remittance.userId}`);
          continue;
        }

        const remittanceData = await codRemittance.findOne({
          userId: remittance.userId,
        });

        if (!remittanceData) {
          console.log(
            `No remittance record found for user ${remittance.userId}`
          );
          continue;
        }

        const deliveryStr = remittance.deliveryDate.toISOString().split("T")[0];

        let rechargeAmount = remittanceData.rechargeAmount || 0;
        let extraAmount = 0;
        let remainingRecharge = 0;

        if (rechargeAmount <= remittance.totalCod) {
          remainingRecharge = remittance.totalCod - rechargeAmount;
          extraAmount = rechargeAmount;
          rechargeAmount = 0;
        } else {
          rechargeAmount -= remittance.totalCod;
          extraAmount = remittance.totalCod;
          remainingRecharge = 0;
        }
        if (
          typeof remittanceData.CODToBeRemitted !== "number" ||
          isNaN(remittanceData.CODToBeRemitted)
        ) {
          console.log(
            `❌ CODToBeRemitted is invalid for remittance ${remittance._id}:`,
            remittanceData.CODToBeRemitted
          );
          continue;
        }
        const codToBeRemitted = Number(remittanceData.CODToBeRemitted);
        const recharge = Number(remainingRecharge);
        const codToBeDeducted = Math.min(
          Number(codToBeRemitted) || 0,
          Number(recharge) || 0
        );
        let creditedAmount = 0;
        let afterWallet = wallet.balance;
        let remainingExtraCodcal = remainingRecharge;

        if (wallet.balance < 0) {
          const adjustAmount = Math.min(
            remainingRecharge,
            Math.abs(wallet.balance)
          );
          creditedAmount = adjustAmount;
          remainingExtraCodcal = remainingRecharge - adjustAmount;
          afterWallet += adjustAmount;
        }
        // console.log("-------->",creditedAmount,afterWallet,remainingExtraCodcal)

        await Wallet.updateOne(
          { _id: wallet._id },
          { $set: { balance: afterWallet } }
        );

        const charges = Number(
          ((remainingExtraCodcal * planCharges) / 100).toFixed(2)
        );
        const TotalDeduction = Number(
          (charges + creditedAmount + extraAmount).toFixed(2)
        );
        // console.log("---------->",TotalDeduction)
        const totalCod = Number((remainingExtraCodcal - charges).toFixed(2));
        const updateRes = await codRemittance.updateOne(
          {
            userId: remittance.userId,
          },
          {
            $inc: {
              CODToBeRemitted: -codToBeDeducted,
              RemittanceInitiated: codToBeDeducted, // match deduction amount
              TotalDeductionfromCOD: TotalDeduction,
            },

            $set: {
              rechargeAmount: rechargeAmount, // or just `rechargeAmount` if same name
            },
          }
        );

        if (updateRes.modifiedCount === 0) {
          console.log(
            `Already processed or concurrent update for ${remittance._id}`
          );
          continue;
        }
        const remitanceId = Math.floor(10000 + Math.random() * 90000);
        // console.log("--->",remitanceId)
        const remittanceEntryForUser = {
          date: today,
          remittanceId: remitanceId,
          codAvailable: Number(totalCod.toFixed(2)),
          amountCreditedToWallet: extraAmount,
          adjustedAmount: creditedAmount,
          earlyCodCharges: Number(charges.toFixed(2)),
          status: totalCod === 0 ? "Paid" : "Pending",
          orderDetails: {
            date: today,
            codcal: remittance.totalCod,
            orders: [...remittance.orderIds],
          },
        };
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
            codcal: remittance.totalCod,
            orders: [...remittance.orderIds],
          },
        };

        try {
          // Uncomment and use the logic you need
          if (isNotSunday) {
            const shouldRemitToday =
              [1, 4, 7].includes(planDays) || // Always remit on these days
              (planDays === 2 && isTodayMWF) || // MWF plan
              (planDays === 3 && isTodayTF) || // Tue/Fri plan
              dayDiff > planDays; // Catch-up for missed days

            if (shouldRemitToday) {
              await new adminCodRemittance(remittanceEntry).save();
              remittanceData.remittanceData.push(remittanceEntryForUser);
            } else {
              await new afterPlan(remittanceEntry).save();
            }
          } else {
            await new afterPlan(remittanceEntry).save();
          }

          // Save once after pushing any entries
          await remittanceData.save();

          await SameDateDelivered.updateOne(
            { _id: remittance._id },
            { $set: { status: "Completed" } }
          );

          console.log(`✅ Remittance processed for ${remittance.userId}`);
        } catch (err) {
          console.error("❌ Failed to save remittance entry:", err.message);
          console.error("Entry Data:", remittanceEntry);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in remittance schedule:", error);
  }
};
// remittanceScheduleData();
cron.schedule("45 1 * * *", () => {
  console.log("Running scheduled task at 1:45 AM: Fetching orders...");
  remittanceScheduleData();
});

const fetchExtraData = async () => {
  try {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday
    const isNotSunday = day !== 0;
    const isTodayMWF = [1, 3, 5].includes(day);
    const isTodayTF = [2, 5].includes(day);

    const afterCodPlans = await afterPlan.find();

    for (const plan of afterCodPlans) {
      const codPlan = await CodPlan.findOne({ user: plan.userId });
      if (!codPlan || !codPlan.planName) {
        console.log(`⛔ Skipping: No COD plan for user ${plan.userId}`);
        continue;
      }

      const planDays = parseInt(codPlan.planName.replace(/\D/g, ""), 10);

      // --- Catch-up logic for missed payouts ---
      const dayDiff = Math.floor(
        (today - new Date(plan.orderDetails?.date || today)) /
          (1000 * 60 * 60 * 24)
      );
      const shouldMoveToAdmin =
        (isNotSunday &&
          ([1, 4, 7].includes(planDays) ||
            (planDays === 2 && isTodayMWF) ||
            (planDays === 3 && isTodayTF))) ||
        dayDiff >= planDays;

      if (!shouldMoveToAdmin) {
        console.log(`⏭️ Skipping user ${plan.userId}: Not yet due`);
        continue;
      }

      const orderDetails = plan.orderDetails || {};
      const newRemittance = new adminCodRemittance({
        date: today,
        userId: plan.userId,
        userName: plan.userName,
        remitanceId: plan.remitanceId,
        totalCod: plan.totalCod,
        amountCreditedToWallet: plan.amountCreditedToWallet,
        adjustedAmount: plan.adjustedAmount,
        earlyCodCharges: plan.earlyCodCharges,
        status: plan.totalCod === 0 ? "Paid" : "Pending",
        orderDetails: {
          date: orderDetails.date || today,
          codcal: orderDetails.codcal || 0,
          orders: orderDetails.orders || [],
        },
      });

      const remittanceEntryForUser = {
        date: today,
        remittanceId: plan.remitanceId,
        codAvailable: Number(plan.totalCod.toFixed(2)),
        amountCreditedToWallet: plan.amountCreditedToWallet,
        adjustedAmount: plan.adjustedAmount,
        earlyCodCharges: Number(plan.earlyCodCharges.toFixed(2)),
        status: plan.totalCod === 0 ? "Paid" : "Pending",
        orderDetails: {
          date: orderDetails.date || today,
          codcal: orderDetails.codcal || 0,
          orders: orderDetails.orders || [],
        },
      };

      // --- Atomic migration ---
      await Promise.all([
        newRemittance.save(),
        codRemittance.findOneAndUpdate(
          { userId: plan.userId },
          { $push: { remittanceData: remittanceEntryForUser } }
        ),
        afterPlan.findByIdAndDelete(plan._id),
      ]);

      console.log(`✅ Migrated COD for user: ${plan.userId}`);
    }
  } catch (error) {
    console.error("❌ Error in fetchExtraData:", error.message);
  }
};

cron.schedule("25 2 * * *", () => {
  console.log("Running scheduled task at 2:25 AM: Migrating afterPlan...");
  fetchExtraData();
});
fetchExtraData();

const codRemittanceData = async (req, res) => {
  try {
    const {
      id,
      fromDate,
      toDate,
      remittanceIdFilter,
      utrFilter,
      statusFilter,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      !limitQuery || limitQuery === "All" ? null : Number(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const userId = id || req.user._id;

    const remittanceDoc = await codRemittance.findOne({ userId }).lean();
    if (!remittanceDoc) {
      return res.status(404).json({
        success: false,
        message: "No remittance data found for this user",
      });
    }

    // ---- Normalize rows ----
    let rows = Array.isArray(remittanceDoc.remittanceData)
      ? remittanceDoc.remittanceData.map((r) => {
          const dateVal = r.date ?? r.data ?? null;
          return {
            ...r,
            date: dateVal ? new Date(dateVal) : null,
            status: r.status || "Pending",
            codAvailable: Number(r.codAvailable || 0),
            amountCreditedToWallet: Number(r.amountCreditedToWallet || 0),
            earlyCodCharges: Number(r.earlyCodCharges || 0),
            adjustedAmount: Number(r.adjustedAmount || 0),
            utr: r.utr ?? "",
          };
        })
      : [];

    // ---- Filters ----
    if (remittanceIdFilter) {
      const terms = remittanceIdFilter
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      rows = rows.filter((e) => {
        const idStr = e.remittanceId ? String(e.remittanceId) : "";
        return terms.some((t) => idStr.includes(t));
      });
    }

    if (utrFilter) {
      const terms = utrFilter
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      rows = rows.filter((e) => {
        const utrStr = e.utr ? String(e.utr) : "";
        return terms.some((t) => utrStr.includes(t));
      });
    }

    if (statusFilter) {
      rows = rows.filter((e) => e.status === statusFilter.trim());
    }

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      rows = rows.filter((e) => e.date && e.date >= start && e.date <= end);
    }

    // ---- Sort newest first ----
    rows.sort((a, b) => {
      const aTime = a.date ? a.date.getTime() : 0;
      const bTime = b.date ? b.date.getTime() : 0;
      return bTime - aTime;
    });

    // ---- Pagination ----
    const totalCount = rows.length;
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
    const paginated = limit ? rows.slice(skip, skip + limit) : rows;

    // ---- DATASET totals (from ALL filtered rows, before pagination) ----
    const datasetTotals = rows.reduce(
      (acc, e) => {
        if (e.status === "Paid") {
          acc.totalCodRemitted += e.codAvailable;
        } else if (e.status === "Pending") {
          acc.remittanceInitiated += e.codAvailable; // as requested
        }
        // Deduction across ALL rows
        acc.totalDeductions +=
          e.amountCreditedToWallet + e.earlyCodCharges + e.adjustedAmount;
        return acc;
      },
      { totalCodRemitted: 0, totalDeductions: 0, remittanceInitiated: 0 }
    );

    // ---- VISIBLE totals (from PAGINATED rows only) ----
    const visibleTotals = paginated.reduce(
      (acc, e) => {
        if (e.status === "Paid") {
          acc.totalCodRemitted += e.codAvailable;
        } else if (e.status === "Pending") {
          acc.totalRemittanceInitiated += e.codAvailable; // matches table rows shown
        }
        acc.totalDeductions +=
          e.amountCreditedToWallet + e.earlyCodCharges + e.adjustedAmount;
        return acc;
      },
      { totalCodRemitted: 0, totalDeductions: 0, totalRemittanceInitiated: 0 }
    );

    return res.status(200).json({
      success: true,
      message: "COD remittance data retrieved successfully",
      total: totalCount,
      page,
      limit: limit || "All",
      totalPages,
      data: {
        // Snapshot-like values, but now computed from the FILTERED DATASET
        TotalCODRemitted: Number(datasetTotals.totalCodRemitted.toFixed(2)),
        TotalDeductionfromCOD: Number(datasetTotals.totalDeductions.toFixed(2)), // ✅ fixed
        RemittanceInitiated: Number(
          datasetTotals.remittanceInitiated.toFixed(2)
        ), // ✅ sum of pending codAvailable
        CODToBeRemitted: Number(remittanceDoc.CODToBeRemitted || 0),
        LastCODRemitted: Number(remittanceDoc.LastCODRemitted || 0),
        rechargeAmount: Number(remittanceDoc.rechargeAmount || 0),

        // What the user sees on THIS page
        visibleSummary: {
          totalCodRemitted: Number(visibleTotals.totalCodRemitted.toFixed(2)),
          totalDeductions: Number(visibleTotals.totalDeductions.toFixed(2)),
          totalRemittanceInitiated: Number(
            visibleTotals.totalRemittanceInitiated.toFixed(2)
          ),
        },

        remittanceData: paginated,
      },
    });
  } catch (error) {
    console.error("Error fetching COD remittance data:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving COD remittance data",
      error: error.message,
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
    const userId = req.user._id;
    const { amount, walletId } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid recharge amount" });
    }

    const remittanceRecord = await codRemittance.findOne({ userId }).lean();
    if (!remittanceRecord) {
      return res.status(404).json({ message: "Remittance record not found" });
    }

    // Calculate actual pending COD available from remittanceData
    const pendingCodAvailable = Array.isArray(remittanceRecord.remittanceData)
      ? remittanceRecord.remittanceData
          .filter((r) => r.status === "Pending")
          .reduce((sum, r) => sum + Number(r.codAvailable || 0), 0)
      : 0;

    // Check if requested recharge exceeds pending COD available
    if (amount > pendingCodAvailable) {
      return res.status(400).json({
        message: "Insufficient COD Available Balance",
        available: pendingCodAvailable,
      });
    }

    const currentWallet = await Wallet.findById(walletId);
    if (!currentWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Update remittance amounts
    await codRemittance.updateOne(
      { _id: remittanceRecord._id },
      {
        $inc: {
          CODToBeRemitted: -amount,
          rechargeAmount: amount,
          RemittanceInitiated: -amount,
        },
      }
    );

    // Push transaction and update wallet balance atomically
    await currentWallet.updateOne({
      $inc: { balance: amount },
      $push: {
        transactions: {
          category: "credit",
          amount,
          balanceAfterTransaction: currentWallet.balance + amount,
          date: new Date(),
          description: "Recharge from COD Remittance",
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "COD remittance recharge processed successfully.",
    });
  } catch (error) {
    console.error("Error processing COD remittance recharge:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process COD remittance recharge.",
      error: error.message,
    });
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
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileData = new File({
      filename: req.file.filename,
      date: new Date(),
      status: "Processing",
    });
    await fileData.save();

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let codRemittances = [];

    if (fileExtension === ".csv") {
      codRemittances = await parseCSV(req.file.path);
    } else if ([".xlsx", ".xls"].includes(fileExtension)) {
      codRemittances = await parseExcel(req.file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    if (!codRemittances.length) {
      return res
        .status(400)
        .json({ error: "The uploaded file is empty or invalid" });
    }

    let errors = [];
    let remittanceUpdates = [];
    let userUpdates = [];
    let orderUpdates = [];

    for (const row of codRemittances) {
      const remittanceId = row["*RemittanceID"];
      const utr = row["*UTR"] || "N/A";

      const remittance = await adminCodRemittance.findOne({
        remitanceId: remittanceId,
      });
      if (!remittance) {
        errors.push(`Remittance ID ${remittanceId} not found`);
        continue;
      }

      let userRemittance = await codRemittance.findOne({
        userId: remittance.userId,
      });
      if (!userRemittance) {
        userRemittance = new codRemittance({
          userId: remittance.userId,
          TotalCODRemitted: 0,
          TotalDeductionfromCOD: 0,
          RemittanceInitiated: 0,
          remittanceData: [],
        });
      }

      // Skip if already marked Paid
      const alreadyPaid = userRemittance.remittanceData.some(
        (e) => e.remittanceId === remittanceId && e.status === "Paid"
      );
      if (alreadyPaid) {
        continue;
      }

      // Deduct initiated amount only if available
      const paymentAmounts = [];
      for (const item of remittance.orderDetails.orders) {
        const order = await Order.findOne({ _id: item });
        if (!order) continue;

        const amt = Number(order?.paymentDetails?.amount || 0);
        paymentAmounts.push(amt);

        orderUpdates.push({
          updateOne: {
            filter: { orderID: order.orderId },
            update: { $set: { status: "Paid" } },
          },
        });
      }

      const totalPayment = paymentAmounts.reduce((a, b) => a + b, 0);
      if (userRemittance.RemittanceInitiated >= totalPayment) {
        userRemittance.RemittanceInitiated -= totalPayment;
      }

      // Update totals
      userRemittance.TotalCODRemitted += Number(remittance.totalCod || 0);
      userRemittance.TotalDeductionfromCOD +=
        Number(remittance.amountCreditedToWallet || 0) +
        Number(remittance.earlyCodCharges || 0) +
        Number(remittance.adjustedAmount || 0);

      // Add/Update remittanceData
      userRemittance.remittanceData.push({
        date: remittance.date,
        remittanceId: remittance.remitanceId,
        utr,
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

      userUpdates.push(userRemittance.save());
      remittanceUpdates.push(
        adminCodRemittance.updateOne(
          { _id: remittance._id },
          { $set: { status: "Paid" } }
        )
      );
    }

    await Promise.all([
      ...userUpdates,
      ...remittanceUpdates,
      ...(orderUpdates.length
        ? CodRemittanceOrdersModel.bulkWrite(orderUpdates)
        : []),
    ]);

    fs.unlink(req.file.path, () => {});

    return res.status(200).json({
      message: "COD Remittance upload processed",
      file: fileData,
      errors,
    });
  } catch (error) {
    console.error("Error in uploadCodRemittance:", error);
    res.status(500).json({ error: "Error processing the file" });
  }
};

const CheckCodplan = async (req, res) => {
  try {
    // console.log("reddd", req.query);
    const { id } = req.query;
    const userId = id || req.user?._id; // Ensure req.user exists
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
    const { id } = req.params; // Remittance ID
    const userID = req.user._id;

    if (!id) {
      return res.status(400).json({ error: "Remittance ID is required." });
    }

    // Fetch remittance data for the current user
    const remittanceData = await codRemittance.findOne({ userId: userID });
    if (!remittanceData) {
      return res.status(404).json({ error: "Remittance data not found." });
    }

    // Find the specific remittance transaction
    const result = remittanceData.remittanceData.find(
      (item) => String(item.remittanceId) === String(id)
    );
    if (!result) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    if (!result.orderDetails || !Array.isArray(result.orderDetails.orders)) {
      return res
        .status(400)
        .json({ error: "Invalid remittance order details." });
    }

    // Fetch all orders in a single query for performance
    const orderdata = await Order.find({
      _id: { $in: result.orderDetails.orders },
    });

    // Construct the response object
    const transactions = {
      remittanceId: id,
      date: result.date,
      totalOrders: result.orderDetails.orders.length,
      remittanceAmount: result.codAvailable,
      deliveryDate: result.orderDetails.date,
      orders: orderdata,
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
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit = limitQuery === "All" ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const searchFilter = req.query.searchFilter?.trim().toLowerCase() || "";
    const orderIdAwbNumberFilter =
      req.query.orderIdAwbNumberFilter?.trim() || "";
    const statusFilter = req.query.statusFilter?.trim() || "";
    const courierProvider =
      req.query.courierProvider?.trim().toLowerCase() || "";

    let matchStage = {};

    // Employee AWB restriction
    if (req.employee?.employeeId) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });
      const allocatedUserIds = allocations.map((a) =>
        a.sellerMongoId.toString()
      );

      if (allocatedUserIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "COD remittance orders retrieved successfully",
          total: 0,
          page,
          limit: limit || "All",
          totalPages: 1,
          data: {
            totalCODAmount: 0,
            paidCODAmount: 0,
            pendingCODAmount: 0,
            orders: [],
          },
        });
      }

      const orders = await Order.find(
        {
          userId: {
            $in: allocatedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
        { awb_number: 1 }
      ).lean();

      const allowedAwbNumbers = orders
        .map((o) => o.awb_number?.toString())
        .filter(Boolean);
      if (allowedAwbNumbers.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No COD remittance orders for this employee",
          total: 0,
          page,
          limit: limit || "All",
          totalPages: 1,
          data: {
            totalCODAmount: 0,
            paidCODAmount: 0,
            pendingCODAmount: 0,
            orders: [],
          },
        });
      }

      matchStage.AwbNumber = { $in: allowedAwbNumbers };
    }

    // Search filter
    if (searchFilter) {
      matchStage.$or = [
        { userName: { $regex: searchFilter, $options: "i" } },
        { PhoneNumber: { $regex: searchFilter, $options: "i" } },
        { Email: { $regex: searchFilter, $options: "i" } },
      ];
    }

    // Order ID / AWB filter
    if (orderIdAwbNumberFilter) {
      const filterValues = orderIdAwbNumberFilter
        .split(",")
        .map((v) => v.trim());
      matchStage.$or = (matchStage.$or || []).concat([
        { orderID: { $in: filterValues } },
        { AwbNumber: { $in: filterValues } },
      ]);
    }

    // Status filter
    if (statusFilter) {
      matchStage.status = { $regex: statusFilter, $options: "i" };
    }

    // Courier provider filter
    if (courierProvider) {
      matchStage.courierProvider = { $regex: courierProvider, $options: "i" };
    }

    // Fetch and paginate in MongoDB
    const aggregationPipeline = [
      { $match: matchStage },
      {
        $addFields: {
          codAmountNum: { $toDouble: { $ifNull: ["$CODAmount", 0] } },
        },
      },
      { $sort: { _id: -1 } },
    ];

    if (limit) {
      aggregationPipeline.push({ $skip: skip }, { $limit: limit });
    }

    const orders = await CourierCodRemittance.aggregate(aggregationPipeline);

    // Calculate totals directly in DB
    const totalsAgg = await CourierCodRemittance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCODAmount: {
            $sum: { $toDouble: { $ifNull: ["$CODAmount", 0] } },
          },
          paidCODAmount: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Paid"] },
                { $toDouble: { $ifNull: ["$CODAmount", 0] } },
                0,
              ],
            },
          },
          pendingCODAmount: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Pending"] },
                { $toDouble: { $ifNull: ["$CODAmount", 0] } },
                0,
              ],
            },
          },
        },
      },
    ]);

    const totals = totalsAgg[0] || {
      totalCODAmount: 0,
      paidCODAmount: 0,
      pendingCODAmount: 0,
    };

    const totalCount = await CourierCodRemittance.countDocuments(matchStage);
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

    return res.status(200).json({
      success: true,
      message: "COD remittance orders retrieved successfully",
      total: totalCount,
      page,
      limit: limit || "All",
      totalPages,
      data: { ...totals, orders },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving COD remittance orders",
      error: error.message,
    });
  }
};

const getAdminCodRemitanceData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const userNameFilter = req.query.userNameFilter;
    const remittanceIdFilter = req.query.remittanceIdFilter;
    const statusFilter = req.query.statusFilter;
    const limit = limitQuery === "All" ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    // --- Employee filtering logic ---
    let allocatedUserIds = null;
    let allowedRemittanceIds = null;
    if (req.employee && req.employee.employeeId) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });
      allocatedUserIds = allocations.map((a) => a.sellerMongoId.toString());
      if (allocatedUserIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "COD remittance orders retrieved successfully",
          total: 0,
          page,
          limit: limit || "All",
          totalPages: 1,
          data: {
            totalCODAmount: 0,
            paidCODAmount: 0,
            pendingCODAmount: 0,
            orders: [],
          },
        });
      }
      // Find all remittanceIds for allocated users
      const remittances = await adminCodRemittance
        .find(
          {
            userId: {
              $in: allocatedUserIds.map(
                (id) => new mongoose.Types.ObjectId(id)
              ),
            },
          },
          { remitanceId: 1 }
        )
        .lean();
      allowedRemittanceIds = remittances.map((r) => r.remitanceId?.toString());
    }

    // Fetch all admin COD remittance orders
    let matchStage = {};
    if (allowedRemittanceIds) {
      matchStage.remitanceId = { $in: allowedRemittanceIds };
    }

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const allOrders = await adminCodRemittance.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          codAmountNum: { $toDouble: { $ifNull: ["$orderDetails.codcal", 0] } },
        },
      },
      {
        $sort: {
          _id: -1, // Sort by insertion order: latest first
        },
      },
    ]);

    if (!allOrders || allOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "COD remittance orders retrieved successfully",
        total: 0,
        page,
        limit: limit || "All",
        totalPages: 1,
        data: {
          totalCODAmount: 0,
          paidCODAmount: 0,
          pendingCODAmount: 0,
          orders: [],
        },
      });
    }

    // Calculate totals with same filter
    let totals = await adminCodRemittance.aggregate([
      {
        $match: matchStage,
      },
      {
        $addFields: {
          codAmountNum: { $toDouble: { $ifNull: ["$orderDetails.codcal", 0] } },
        },
      },
      {
        $group: {
          _id: null,
          totalCODAmount: { $sum: "$codAmountNum" },
          paidCODAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Paid"] }, "$codAmountNum", 0],
            },
          },
          pendingCODAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Pending"] }, "$codAmountNum", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalCODAmount: 1,
          paidCODAmount: 1,
          pendingCODAmount: 1,
        },
      },
    ]);
    if (!totals || totals.length === 0) {
      totals = [{ totalCODAmount: 0, paidCODAmount: 0, pendingCODAmount: 0 }];
    }

    // Apply filters conditionally
    let filteredOrders = allOrders;

    // Filter by userName
    if (userNameFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.userName?.toLowerCase().includes(userNameFilter.toLowerCase())
      );
    }

    // Filter by remittanceId
    if (remittanceIdFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.remitanceId?.toString().includes(remittanceIdFilter)
      );
    }
    // Filter by statusFilter
    if (statusFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.status?.toString().includes(statusFilter)
      );
    }

    const totalCount = filteredOrders.length;
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
    const paginatedData = limit
      ? filteredOrders.slice(skip, skip + limit)
      : filteredOrders;

    return res.status(200).json({
      success: true,
      message: "COD remittance orders retrieved successfully",
      total: totalCount,
      page,
      limit: limit || "All",
      totalPages,
      data: {
        totalCODAmount: totals[0]?.totalCODAmount || 0,
        paidCODAmount: totals[0]?.paidCODAmount || 0,
        pendingCODAmount: totals[0]?.pendingCODAmount || 0,
        orders: paginatedData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const CodRemittanceOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit = limitQuery === "All" ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const {
      searchFilter = "",
      orderIdAwbNumberFilter = "",
      statusFilter = "",
      courierProvider = "",
      startDate,
      endDate,
    } = req.query;

    let allocatedUserIds = null;
    let allowedOrderIds = null;

    // Employee role filtering
    if (req.employee?.employeeId) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });
      allocatedUserIds = allocations.map((a) => a.sellerMongoId.toString());

      if (!allocatedUserIds.length) {
        return res.status(200).json({
          success: true,
          message: "No allocated users",
          total: 0,
          data: { orders: [] },
        });
      }

      const orders = await Order.find(
        {
          userId: {
            $in: allocatedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
        { orderId: 1 }
      ).lean();

      allowedOrderIds = orders.map((o) => o.orderId?.toString());
    }

    // Build MongoDB match object
    let matchStage = {};
    if (allowedOrderIds) {
      matchStage.orderID = { $in: allowedOrderIds };
    }
    if (statusFilter) {
      matchStage.status = statusFilter;
    }
    if (courierProvider) {
      matchStage.courierProvider = new RegExp(`^${courierProvider}$`, "i");
    }
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (orderIdAwbNumberFilter) {
      const filterValues = orderIdAwbNumberFilter
        .split(",")
        .map((val) => val.trim());
      matchStage.$or = [
        { orderID: { $in: filterValues } },
        { AWB_Number: { $in: filterValues } },
      ];
    }

    // MongoDB aggregation
    const allOrders = await CodRemittanceOrdersModel.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          codAmountNum: { $toDouble: { $ifNull: ["$CODAmount", 0] } },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Filter by searchFilter in memory (name/phone/email search is trickier in MongoDB without $regex)
    let filteredOrders = allOrders;
    if (searchFilter) {
      const lowerCaseFilter = searchFilter.toLowerCase();
      filteredOrders = allOrders.filter(
        (order) =>
          (order.userName || "").toLowerCase().includes(lowerCaseFilter) ||
          (order.PhoneNumber || "").toLowerCase().includes(lowerCaseFilter) ||
          (order.Email || "").toLowerCase().includes(lowerCaseFilter)
      );
    }

    // Pagination
    const totalCount = filteredOrders.length;
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
    const paginatedData = limit
      ? filteredOrders.slice(skip, skip + limit)
      : filteredOrders;

    // Totals
    const totalCODAmount = filteredOrders.reduce(
      (sum, o) => sum + (o.codAmountNum || 0),
      0
    );
    const paidCODAmount = filteredOrders
      .filter((o) => o.status === "Paid")
      .reduce((sum, o) => sum + (o.codAmountNum || 0), 0);
    const pendingCODAmount = filteredOrders
      .filter((o) => o.status === "Pending")
      .reduce((sum, o) => sum + (o.codAmountNum || 0), 0);

    return res.status(200).json({
      success: true,
      message: "COD remittance orders retrieved successfully",
      total: totalCount,
      page,
      limit: limit || "All",
      totalPages,
      data: {
        totalCODAmount,
        paidCODAmount,
        pendingCODAmount,
        orders: paginatedData,
      },
    });
  } catch (error) {
    console.error("Error fetching COD remittance orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving COD remittance orders",
      error: error.message,
    });
  }
};

const sellerremittanceTransactionData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Remittance ID is required.",
      });
    }

    // Fetch remittance data
    const remittanceData = await adminCodRemittance
      .findOne({ remitanceId: id })
      .lean();
    if (!remittanceData) {
      return res.status(404).json({
        success: false,
        message: "Remittance data not found.",
      });
    }

    const userId = remittanceData.userId;

    // Parallel fetch: Bank details, User (to get Wallet ID)
    const [bankDetails, user] = await Promise.all([
      BankAccountDetails.findOne({ user: userId }).lean(),
      users.findById(userId).lean(),
    ]);

    const wallet = user?.Wallet
      ? await Wallet.findById(user.Wallet).lean()
      : null;

    // Fetch all orders in a single query
    const orderIds = remittanceData.orderDetails?.orders || [];
    const filteredOrders = orderIds.length
      ? await Order.find({ _id: { $in: orderIds } }).lean()
      : [];

    const transactions = {
      remitanceId: id,
      date: remittanceData.date || "N/A",
      totalOrder: filteredOrders.length,
      totalCOD: remittanceData.orderDetails?.codcal || 0,
      remitanceAmount: remittanceData.codAvailable || 0,
      deliveryDate: remittanceData.orderDetails?.date || "N/A",
      status: remittanceData.status || "N/A",
      orderDataInArray: filteredOrders,
      bankDetails: {
        accountHolderName: bankDetails?.nameAtBank || "N/A",
        accountNumber: bankDetails?.accountNumber || "N/A",
        ifscCode: bankDetails?.ifsc || "N/A",
        bankName: bankDetails?.bank || "N/A",
        branchName: bankDetails?.branch || "N/A",
        balance: wallet?.balance || 0,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Remittance transaction data retrieved successfully.",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching remittance transaction data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving transaction data.",
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

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let codRemittances = [];

    // Parse file
    if (fileExtension === ".csv") {
      codRemittances = await parseCSV(req.file.path, fileData);
    } else if ([".xlsx", ".xls"].includes(fileExtension)) {
      codRemittances = await parseExcel(req.file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    if (!codRemittances?.length) {
      return res.status(400).json({
        error: "The uploaded file is empty or contains invalid data",
      });
    }

    // Fetch user's remittance once
    let userRemittance = await CourierCodRemittance.findOne({ userId: userID });
    if (!userRemittance) {
      return res
        .status(404)
        .json({ error: "User remittance record not found" });
    }

    let updated = false;

    // Normalize keys for matching
    const normalize = (val) => (val ? val.toString().trim() : "");

    for (const row of codRemittances) {
      const awbNumber = normalize(row["*AWB Number"] || row["AWBNumber"]);
      const codAmount = parseFloat(row["*COD Amount"] || row["CODAmount"]) || 0;

      const orderIndex = userRemittance.CourierCodRemittanceData.findIndex(
        (data) => normalize(data.AwbNumber) === awbNumber
      );

      if (
        orderIndex !== -1 &&
        userRemittance.CourierCodRemittanceData[orderIndex].status === "Pending"
      ) {
        userRemittance.CourierCodRemittanceData[orderIndex].status = "Paid";
        userRemittance.TransferredRemittance =
          (userRemittance.TransferredRemittance || 0) + codAmount;
        userRemittance.TotalRemittanceDue =
          (userRemittance.TotalRemittanceDue || 0) - codAmount;

        updated = true;
      }
    }

    if (updated) {
      await userRemittance.save();
    }

    // Delete file after DB update
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("File deleted successfully:", req.file.path);
    });

    return res.status(200).json({
      message: "Courier COD uploaded successfully",
      file: fileData,
    });
  } catch (error) {
    console.error("Error in uploadCourierCodRemittance:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the file" });
  }
};

const exportOrderInRemittance = async (req, res) => {
  try {
    const userID = req.user._id;
    const ids = req.query.ids; // should be an array: ['REMID123', 'REMID456']

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "Remittance IDs must be an array." });
    }

    // Fetch remittance records
    const remittances = await adminCodRemittance
      .find({
        remitanceId: { $in: ids },
      })
      .populate("orderDetails");

    // Flatten all order ObjectIds from each remittance's `orders` array
    const allOrders = remittances.flatMap((remit) => remit.orderDetails);
    const orderIds = allOrders.flatMap((i) => i.orders);
    // Optional: Populate actual order data
    const rawOrders = await Order.find(
      { _id: { $in: orderIds } },
      {
        orderId: 1,
        courierServiceName: 1,
        awb_number: 1,
        "paymentDetails.method": 1,
        "paymentDetails.amount": 1,
        tracking: 1, // Include tracking to extract delivery date
      }
    );

    // Extract only needed info and delivery date from tracking
    const orderDetails = rawOrders.map((order) => {
      const deliveryEvent = order.tracking.find(
        (event) => event.status?.toLowerCase() === "delivered"
      );

      return {
        orderId: order.orderId,
        courierServiceName: order.courierServiceName,
        awb_number: order.awb_number,
        paymentMethod: order.paymentDetails?.method,
        paymentAmount: order.paymentDetails?.amount,
        deliveryDate: deliveryEvent?.StatusDateTime
          ? new Date(deliveryEvent.StatusDateTime).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null,
      };
    });

    res.json({
      success: true,
      totalOrders: orderDetails.length,
      orders: orderDetails,
    });
  } catch (error) {
    console.error("Error exporting remittance orders:", error);
    res
      .status(500)
      .json({ message: "Server error while exporting remittance orders" });
  }
};

module.exports = {
  codPlanUpdate,
  codToBeRemitteds,
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
  exportOrderInRemittance,
};
