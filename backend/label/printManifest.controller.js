// const express = require("express");
// const cors = require("cors");
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");
// const bwipjs = require("bwip-js");
// const Order = require("../models/newOrder.model");

// const app = express();
// app.use(cors());

// app.get("/generate-pdf/:id", async (req, res) => {
//   try {
//     const manifestId = req.params.id;
//     const order = await Order.findOne({ _id: manifestId });

//     if (!order) {
//       return res.status(404).send("Order not found");
//     }

//     const doc = new PDFDocument({ margin: 30 });
//     const filePath = path.join(__dirname, "manifest.pdf");
//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);

//     // Title
//     doc.fontSize(18).text("Shipex India Manifest", { align: "center" });
//     doc.moveDown(0.5);
//     const currentDateTime = new Date().toLocaleString("en-IN", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });

//     doc
//       .fontSize(12)
//       .text(`Generated on ${currentDateTime}`, { align: "center" });

//     doc.moveDown(1);

//     // Seller & Manifest Details
//     let yPosition = doc.y;
//     doc
//       .fontSize(11)
//       .text(`Seller: ${order.pickupAddress.contactName}`, 30, yPosition);
//     doc.text(`${order.courierServiceName}`, 30, doc.y + 10);
//     doc
//       .fontSize(10)
//       .text(`Manifest ID: MANIFEST-${order.orderId}`, 400, yPosition, {
//         align: "right",
//       });
//     doc.text("Total Shipments to Dispatch: 1", 400, doc.y + 15, {
//       align: "right",
//     });
//     doc.moveDown(2);

//     // Table Header
//     let tableTop = doc.y;
//     let columnWidths = [50, 180, 50, 80, 150];

//     const drawTableRow = (y, row) => {
//       let x = 30;
//       row.forEach((text, i) => {
//         doc.text(text, x, y, { width: columnWidths[i], align: "center" });
//         x += columnWidths[i];
//       });
//     };

//     // Draw Header Row
//     doc.font("Helvetica-Bold").fontSize(12);
//     drawTableRow(tableTop, [
//       "S.No",
//       "AWD ID",
//       "Order ID",
//       "Content",
//       "Barcode",
//     ]);
//     doc.moveDown(0.5);
//     doc
//       .moveTo(30, tableTop + 15)
//       .lineTo(570, tableTop + 15)
//       .stroke();
//     doc.moveDown(0.5);
//     tableTop += 25;

//     // Product Details
//     let product = order.productDetails ? order.productDetails[0] : {};
//     doc.font("Helvetica").fontSize(12);
//     drawTableRow(tableTop, [
//       "1",
//       order.awb_number || "N/A",
//       order.orderId || "N/A",
//       product.name || "N/A",
//       "",
//     ]);

//     // Generate Barcode
//     const barcodePath = path.join(__dirname, "barcode.png");
//     if (order.awb_number) {
//       await new Promise((resolve, reject) => {
//         bwipjs.toBuffer(
//           {
//             bcid: "code128",
//             text: order.awb_number,
//             scale: 3,
//             height: 10,
//             includetext: true,
//             textxalign: "center",
//           },
//           (err, png) => {
//             if (err) {
//               console.error("Error generating barcode:", err);
//               reject(err);
//             } else {
//               fs.writeFileSync(barcodePath, png);
//               resolve();
//             }
//           }
//         );
//       });
//       doc.image(barcodePath, 420, tableTop - 5, { width: 100, height: 40 });
//     }

//     doc.moveDown(2);

//     // Signature Section
//     doc.moveDown(2);
//     doc
//       .fontSize(12)
//       .font("Helvetica-Bold")
//       .text("To Be Filled By Delhivery Surface Logistics Executive", {
//         align: "center",
//         indent: -400,
//       });
//     doc.moveDown(1);

//     let leftX = 30;
//     let rightX = 310;
//     let signatureY = doc.y;

//     // Row 1
//     doc.font("Helvetica");
//     doc
//       .fontSize(10)
//       .text("Pickup Time:    ____________________________", leftX, signatureY, {
//         width: 300,
//       });
//     doc.text(
//       "Total Items Picked:    ____________________",
//       rightX,
//       signatureY,
//       { width: 300 }
//     );
//     signatureY += 25;

//     // Row 2
//     doc.text(
//       "FE Name:         ____________________________",
//       leftX,
//       signatureY,
//       { width: 300 }
//     );
//     doc.text(
//       "FE Phone:                ____________________________",
//       rightX,
//       signatureY,
//       { width: 300 }
//     );
//     signatureY += 25;

//     // Row 3
//     doc.text(
//       "FE Signature:   ____________________________",
//       leftX,
//       signatureY,
//       { width: 300 }
//     );
//     doc.text(
//       "Seller Signature:       ____________________________",
//       rightX,
//       signatureY,
//       { width: 300 }
//     );
//     doc.moveDown(2);

//     doc
//       .fontSize(10)
//       .text("This is a system-generated document", {
//         align: "center",
//         indent: -300,
//       });

//     doc.end();

//     stream.on("finish", () => {
//       res.download(filePath, "manifest.pdf", (err) => {
//         if (err) {
//           res.status(500).send("Error downloading the file.");
//         }
//         fs.unlinkSync(filePath);
//         if (fs.existsSync(barcodePath)) {
//           fs.unlinkSync(barcodePath);
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const bwipjs = require("bwip-js");
const Order = require("../models/newOrder.model");

const app = express();
app.use(cors());

app.get("/generate-pdf", async (req, res) => {
  try {
    const { orderIds } = req.query; // Accept multiple order IDs
    const orderIdList = Array.isArray(orderIds)
      ? orderIds
      : orderIds.split(",");

    console.log(orderIdList);

    if (!orderIdList.length) {
      return res.status(400).send("No order IDs provided.");
    }

    const orders = await Order.find({ _id: { $in: orderIdList } });

    if (!orders.length) {
      return res.status(404).send("Orders not found");
    }

    // Group Orders by Courier Service
    const groupedOrders = orders.reduce((acc, order) => {
      const courier = order.courierServiceName || "Unknown Courier";
      acc[courier] = acc[courier] || [];
      acc[courier].push(order);
      return acc;
    }, {});

    const doc = new PDFDocument({ margin: 30 });
    const filePath = path.join(__dirname, "manifest.pdf");
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    for (const [courierName, orders] of Object.entries(groupedOrders)) {
      // Title
      doc.fontSize(18).text("Shipex India Manifest", { align: "center" });
      doc.moveDown(0.5);
      const currentDateTime = new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      doc
        .fontSize(12)
        .text(`Generated on ${currentDateTime}`, { align: "center" });
      doc.moveDown(1);

      // Seller & Courier Details
      let yPosition = doc.y;
      doc
        .fontSize(11)
        .text(`Seller: ${orders[0].pickupAddress.contactName}`, 30, yPosition);
      doc.text(`${courierName}`, 30, doc.y + 10);
      const uniqueManifestId = `MANIFEST-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      doc
        .fontSize(10)
        .text(`Manifest ID: ${uniqueManifestId}`, 400, yPosition, {
          align: "right",
        });

      doc
        .fontSize(10)
        .text(
          `Total Shipments to Dispatch: ${orders.length}`,
          400,
          doc.y + 15,
          {
            align: "right",
          }
        );
      doc.moveDown(3);

      // Table Header
      let tableTop = doc.y;
      let columnWidths = [50, 180, 50, 80, 150];

      const drawTableRow = (y, row) => {
        let x = 30;
        row.forEach((text, i) => {
          doc.text(text, x, y, { width: columnWidths[i], align: "center" });
          x += columnWidths[i];
        });
      };

      doc.font("Helvetica-Bold").fontSize(12);
      drawTableRow(tableTop, [
        "S.No",
        "AWD ID",
        "Order ID",
        "Content",
        "Barcode",
      ]);
      doc.moveDown(0.5);
      doc
        .moveTo(30, tableTop + 15)
        .lineTo(570, tableTop + 15)
        .stroke();
      doc.moveDown(0.5);
      tableTop += 25;

      // Generate Barcodes for Each Order
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let product = order.productDetails ? order.productDetails[0] : {};
        let barcodePath = path.join(__dirname, `barcode_${i}.png`);

        await new Promise((resolve, reject) => {
          bwipjs.toBuffer(
            {
              bcid: "code128",
              text: order.awb_number || "N/A",
              scale: 3,
              height: 10,
              includetext: true,
              textxalign: "center",
            },
            (err, png) => {
              if (err) {
                console.error("Error generating barcode:", err);
                reject(err);
              } else {
                fs.writeFileSync(barcodePath, png);
                resolve();
              }
            }
          );
        });

        doc.font("Helvetica").fontSize(12);
        drawTableRow(tableTop, [
          String(i + 1),
          order.awb_number || "N/A",
          order.orderId || "N/A",
          product.name || "N/A",
          "",
        ]);

        doc.image(barcodePath, 420, tableTop - 5, { width: 100, height: 40 });

        tableTop += 40;
      }

      doc.moveDown(2);

      // Signature Section
      doc.moveDown(2);
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("To Be Filled By Delhivery Surface Logistics Executive", {
          align: "center",
          indent: -400,
        });
      doc.moveDown(1);

      let leftX = 30;
      let rightX = 310;
      let signatureY = doc.y;

      doc.font("Helvetica").fontSize(10);
      doc.text(
        "Pickup Time:    ____________________________",
        leftX,
        signatureY,
        { width: 300 }
      );
      doc.text(
        "Total Items Picked:    ____________________",
        rightX,
        signatureY,
        { width: 300 }
      );
      signatureY += 25;

      doc.text(
        "FE Name:         ____________________________",
        leftX,
        signatureY,
        { width: 300 }
      );
      doc.text(
        "FE Phone:                ____________________________",
        rightX,
        signatureY,
        { width: 300 }
      );
      signatureY += 25;

      doc.text(
        "FE Signature:   ____________________________",
        leftX,
        signatureY,
        { width: 300 }
      );
      doc.text(
        "Seller Signature:       ____________________________",
        rightX,
        signatureY,
        { width: 300 }
      );
      doc.moveDown(2);

      doc.fontSize(10).text("This is a system-generated document", {
        align: "center",
        indent: -300,
      });

      if (
        Object.keys(groupedOrders).indexOf(courierName) !==
        Object.keys(groupedOrders).length - 1
      ) {
        doc.addPage(); // Only add a page if it's not the last courier
      }
    }

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, "manifest.pdf", (err) => {
        if (err) {
          res.status(500).send("Error downloading the file.");
        }
        fs.unlinkSync(filePath);
        for (let i = 0; i < orders.length; i++) {
          let barcodePath = path.join(__dirname, `barcode_${i}.png`);
          if (fs.existsSync(barcodePath)) {
            fs.unlinkSync(barcodePath);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
