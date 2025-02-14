// const express = require("express");
// const PDFDocument = require("pdfkit");
// const Order = require("../models/newOrder.model");
// const sharp = require("sharp");
// const fs = require("fs");
// const path = require("path");

// const app = express();

// app.get("/download-invoice/:id", async (req, res) => {
//   const id = req.params.id;
//   console.log(id);
//   const order = await Order.findOne({ _id: id });
//   // console.log(order)
//   const doc = new PDFDocument({ margin: 40 });
//   const filename = "invoice.pdf";

//   // Set headers for downloading
//   res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
//   res.setHeader("Content-Type", "application/pdf");

//   doc.pipe(res);

//   // Title
//   const svgPath = path.join(__dirname, "../public/assets/LOGO.svg");
//   const pngPath = path.join(__dirname, "../public/assets/LOGO.png");

//   sharp(svgPath)
//     .toFormat("png")
//     .toFile(pngPath, (err, info) => {
//       if (err) {
//         console.error("Error converting SVG to PNG:", err);
//       } else {
//         console.log("SVG converted to PNG:", info);
//       }
//     });
//   doc.image(pngPath, 200, 40, { width: 150 });
//   // doc.fontSize(50).text("Shipex", { align: "center" });

//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(0.3);

//   doc.fontSize(16).text("Tax Invoice", { align: "center" }).moveDown(0.5);

//   // Draw separator line
//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

//   // Three-column layout for Shipping Address, Seller, and Invoice Details
//   const startY = doc.y;

//   // Shipping Address
//   doc
//     .fontSize(12)
//     .text("SHIPPING ADDRESS:", 50, startY, { bold: true, underline: true })
//     .moveDown(1);
//   doc.fontSize(10).text("Prikshit Singh").moveDown(0.5);
//   doc.fontSize(10).text("Flat 302, 3rd floor, Vinayak Heights").moveDown(0.5);
//   doc.fontSize(10).text("Near D Mart").moveDown(0.5);
//   doc.fontSize(10).text("Mumbai").moveDown(0.5);
//   doc.fontSize(10).text("Maharashtra").moveDown(0.5);
//   doc.fontSize(10).text("400001").moveDown(0.5);
//   doc.fontSize(10).text("8978675868").moveDown(0.5);

//   // Seller Details
//   doc
//     .fontSize(12)
//     .text("SOLD BY:", 250, startY, { bold: true, underline: true })
//     .moveDown(1);
//   doc.fontSize(10).text("Infistyle India Retail Solution", 250).moveDown(0.5);
//   doc.fontSize(10).text("212, Vidya Nagar, Main Road", 250).moveDown(0.5);
//   doc.fontSize(10).text("Near Honda Agency", 250).moveDown(0.5);
//   doc.fontSize(10).text("Bhhiwani", 250).moveDown(0.5);
//   doc.fontSize(10).text("Haryana", 250).moveDown(0.5);
//   doc.fontSize(10).text("787979", 250).moveDown(0.5);

//   doc.fontSize(10).text("Phone: 9813208652", 250).moveDown(0.5);
//   doc.fontSize(10).text("GSTIN:N/A", 250).moveDown(0.5);

//   doc.fontSize(10).text("Email: vincesingal@gmail.com", 250).moveDown(0.5);

//   // Invoice Details
//   doc
//     .fontSize(12)
//     .text("INVOICE DETAILS:", 400, startY, { bold: true, underline: true })
//     .moveDown(1);
//   doc.fontSize(10).text("Invoice No: INV-626796", 400).moveDown(0.5);
//   doc.fontSize(10).text("Invoice Date: 08-Feb-2025", 400).moveDown(0.5);
//   doc.fontSize(10).text("Order No: 197907", 400).moveDown(0.5);
//   doc.fontSize(10).text("Order Date: 07-Feb-2025", 400).moveDown(0.5);
//   doc.fontSize(10).text("Channel: SHIPEX", 400).moveDown(0.5);
//   doc.fontSize(10).text("Payment Method: PPD", 400).moveDown(0.5);

//   doc.moveDown(7);

//   // Draw separator line
//   // doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

//   // ** Table Headers **
//   let tableTop = doc.y;
//   let columnWidths = [40, 150, 70, 80, 50, 50, 70];

//   const drawTableRow = (y, row) => {
//     let x = 50;
//     row.forEach((text, i) => {
//       doc.text(text, x, y, { width: columnWidths[i], align: "center" });
//       x += columnWidths[i];
//     });
//   };

//   // ** Draw Header Row **
//   doc.font("Helvetica-Bold").fontSize(12);
//   drawTableRow(tableTop, [
//     "S.No",
//     "Product Name",
//     "Quantity",
//     "Unit Price",
//     "SGST",
//     "CGST",
//     "Total",
//   ]);

//   // Draw top border
//   doc
//     .moveTo(50, tableTop - 5)
//     .lineTo(550, tableTop - 5)
//     .stroke();

//   // Move down for first data row
//   tableTop += 20;
//   doc.font("Helvetica").fontSize(12);

//   // ** Table Data **
//   let tableData = [
//     ["1", "Spare Parts Cycle", "3", "2400.00", "0", "0", "7200.00"],
//     ["1", "Spare Parts Cycle", "3", "2400.00", "0", "0", "7200.00"],
//   ];

//   tableData.forEach((row, i) => {
//     drawTableRow(tableTop + i * 20, row);
//   });

//   // Draw bottom border
//   doc
//     .moveTo(50, tableTop + tableData.length * 20 - 5)
//     .lineTo(550, tableTop + tableData.length * 20 - 5)
//     .stroke();

//   doc.moveDown(2);

//   // ** Net Total **
//   doc
//     .fontSize(14)
//     .text("Net Total (In Value) Rs. 7200.00", 200, doc.y, { align: "right" });

//   doc.moveDown(2);
//   // doc.fontSize(12).text("Whether tax is payable under reverse charge - No", 50, doc.y);

//   // doc.moveDown(2);
//   // doc.text("Authorized Signature for Infistyle India Retail Solution", 50, doc.y);

//   doc.end();
// });

// module.exports = app;
const express = require("express");
const PDFDocument = require("pdfkit");
const Order = require("../models/newOrder.model");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();

app.get("/download-invoice/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const order = await Order.findOne({ _id: id });
  console.log(order);
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 40 });
  const filename = "invoice.pdf";

  // Set headers for downloading
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Title
  const svgPath = path.join(__dirname, "../public/assets/LOGO.svg");
  const pngPath = path.join(__dirname, "../public/assets/LOGO.png");

  // Convert SVG to PNG
  try {
    await sharp(svgPath).toFormat("png").toFile(pngPath);
    console.log("SVG converted to PNG");
  } catch (err) {
    console.error("Error converting SVG to PNG:", err);
    return res.status(500).send("Error generating invoice");
  }

  // Add the PNG image to the PDF
  doc.image(pngPath, 220, 40, { width: 170 });
  doc.moveDown(8);
  // Add other content to the PDF
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(0.3);
  doc.fontSize(16).text("Tax Invoice", { align: "center" }).moveDown(0.5);

  // Draw separator line
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

  // Three-column layout for Shipping Address, Seller, and Invoice Details
  const startY = doc.y;

  // Shipping Address
  doc
    .fontSize(12)
    .text("SHIPPING ADDRESS:", 50, startY, { bold: true, underline: true })
    .moveDown(1);
  doc.fontSize(10).text(`${order.pickupAddress.contactName}`).moveDown(0.5);
  doc.fontSize(10).text(`${order.pickupAddress.address}`).moveDown(0.5);
  //   doc.fontSize(10).text("Near D Mart").moveDown(0.5);
  doc.fontSize(10).text(`${order.pickupAddress.city}`).moveDown(0.5);
  doc.fontSize(10).text(`${order.pickupAddress.state}`).moveDown(0.5);
  doc.fontSize(10).text(`${order.pickupAddress.pinCode}`).moveDown(0.5);
  doc.fontSize(10).text(`${order.pickupAddress.phoneNumber}`).moveDown(0.5);

  // Seller Details
  doc
    .fontSize(12)
    .text("SOLD BY:", 250, startY, { bold: true, underline: true })
    .moveDown(1);
  doc
    .fontSize(10)
    .text(`${order.receiverAddress.contactName}`, 250)
    .moveDown(0.5);
  doc.fontSize(10).text(`${order.receiverAddress.address}`, 250).moveDown(0.5);
  //   doc.fontSize(10).text("Near Honda Agency", 250).moveDown(0.5);
  doc.fontSize(10).text(`${order.receiverAddress.city}`, 250).moveDown(0.5);
  doc.fontSize(10).text(`${order.receiverAddress.state}`, 250).moveDown(0.5);
  doc.fontSize(10).text(`${order.receiverAddress.pinCode}`, 250).moveDown(0.5);
  doc
    .fontSize(10)
    .text(`Phone: ${order.receiverAddress.phoneNumber}`, 250)
    .moveDown(0.5);
  doc.fontSize(10).text("GSTIN:N/A", 250).moveDown(0.5);
  doc
    .fontSize(10)
    .text(`Email: ${order.receiverAddress.email}`, 250)
    .moveDown(0.5);

  // Invoice Details
  doc
    .fontSize(12)
    .text("INVOICE DETAILS:", 400, startY, { bold: true, underline: true })
    .moveDown(1);
  doc.fontSize(10).text("Invoice No: INV-626796", 400).moveDown(0.5);
  const orderDate1 = new Date();
  const options1 = { year: "numeric", month: "short", day: "numeric" };
  const formattedOrderDate1 = orderDate1.toLocaleDateString("en-US", options1);
  doc.fontSize(10).text(`Invoice Date: ${formattedOrderDate1}`, 400).moveDown(0.5);
  doc.fontSize(10).text(`Order No: ${order.orderId}`, 400).moveDown(0.5);
  const orderDate2 = new Date(order.createdAt);
  const options2 = { year: "numeric", month: "short", day: "numeric" };
  const formattedOrderDate2 = orderDate2.toLocaleDateString("en-US", options2);
  doc.fontSize(10).text(`Order Date: ${formattedOrderDate2}`, 400).moveDown(0.5);
  doc.fontSize(10).text("Channel: SHIPEX", 400).moveDown(0.5);
  doc.fontSize(10).text(`Payment Method: ${order.paymentDetails.method}`, 400).moveDown(0.5);

  doc.moveDown(7);

  // ** Table Headers **
  let tableTop = doc.y;
  let columnWidths = [40, 150, 70, 80, 50, 50, 70];

  const drawTableRow = (y, row) => {
    let x = 50;
    row.forEach((text, i) => {
      doc.text(text, x, y, { width: columnWidths[i], align: "center" });
      x += columnWidths[i];
    });
  };

  // ** Draw Header Row **
 // Draw Table Headers
doc.font("Helvetica-Bold").fontSize(12);
drawTableRow(tableTop, [
  "S.No",
  "Product Name",
  "Quantity",
  "Unit Price",
  "SGST",
  "CGST",
  "Total",
]);

// Draw top border
doc
  .moveTo(50, tableTop - 5)
  .lineTo(550, tableTop - 5)
  .stroke();

// Move down for first data row
tableTop += 20;
doc.font("Helvetica").fontSize(12);

// ** Table Data **
function calculateTotalPrice(quantity, unitPrice) {
    return quantity * unitPrice;
  }
  let tableData = order.productDetails.map((product, index) => {
    // Calculate total price based on quantity and unit price
    const totalPrice = product.quantity * product.unitPrice;
  
    return [
      (index + 1).toString(), // S.No
      product.name,           // Product Name
      product.quantity.toString(), // Quantity
      product.unitPrice, // Unit Price
      product.sgst || "0.00", // SGST
      product.cgst || "0.00", // CGST
      totalPrice   // Total
    ];
  });
  
tableData.forEach((row, i) => {
  drawTableRow(tableTop + i * 20, row);
});

// Draw bottom border
doc
  .moveTo(50, tableTop + tableData.length * 20 - 5)
  .lineTo(550, tableTop + tableData.length * 20 - 5)
  .stroke();

doc.moveDown(2);

// ** Net Total **
const netTotal = tableData.reduce((sum, row) => sum + parseFloat(row[6]), 0); // Sum of Total column
doc
  .fontSize(14)
  .text(`Net Total (In Value) Rs. ${order.paymentDetails.amount}`, 200, doc.y, { align: "right" });

doc.moveDown(2);
  // doc.fontSize(12).text("Whether tax is payable under reverse charge - No", 50, doc.y);

  // doc.moveDown(2);
  // doc.text("Authorized Signature for Infistyle India Retail Solution", 50, doc.y);

  doc.end();
});

module.exports = app;
