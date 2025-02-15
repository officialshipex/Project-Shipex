const express = require("express");
const PDFDocument = require("pdfkit");
const LabelSetting = require("./label.model");
const bwipjs = require("bwip-js");
const Order = require("../models/newOrder.model");

const router = express.Router();

router.get("/generate-pdf/:id", async (req, res) => {
  try {
    const orderData = await Order.findOne({ _id: req.params.id });
    console.log(orderData);
    if (!orderData) {
      return res.status(404).send("Order not found");
    }

    const barcodeBuffer1 = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: String(orderData.orderId), // Text to encode
      scale: 3, // Scale factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center", // Center-align the text
    });

    const barcodeBuffer2 = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: String(orderData.awb_number), // Text to encode
      scale: 3, // Scale factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center", // Center-align the text
    });

    const options1 = { year: "numeric", month: "short", day: "numeric" };
    const formattedOrderDate1 = orderData.createdAt.toLocaleDateString(
      "en-US",
      options1
    );
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="shipping_label.pdf"`
    );

    // Header Section
    doc.fontSize(16).font("Helvetica-Bold").text(`To:`, { align: "left" });
    doc
      .fontSize(14)
      .font("Helvetica")
      .text(orderData.receiverAddress.contactName, { align: "left" });
    doc.text(
      `${orderData.receiverAddress.address},${orderData.receiverAddress.city},${orderData.receiverAddress.state},${orderData.receiverAddress.pinCode}`,
      { align: "left" }
    );
    doc.text(
      `${orderData.receiverAddress.city},${orderData.receiverAddress.state},${orderData.receiverAddress.pinCode}`,
      { align: "left" }
    );
    // if (!settings.customerSetting.hidePhoneNumber) {
    doc.text(`MOBILE NO: ${orderData.receiverAddress.phoneNumber}`, {
      align: "left",
    });
    // }
    doc.moveDown();

    const startX = 50;
    const startY = doc.y;
    const borderWidth = 500;
    const borderHeight = 1;
    doc
      .rect(startX - 0, startY - 10, borderWidth, borderHeight) // Add padding around the text
      .stroke(); // Draw the border
    doc.moveDown();
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Order Date: `, { continued: true });
    doc.font("Helvetica").text(formattedOrderDate1);
    doc.font("Helvetica-Bold").text(`Invoice No: `, { continued: true });
    doc.font("Helvetica").text(orderData[0].orderId);

    const barcodeX = 380; // X-coordinate for the barcode
    const barcodeY = doc.y - 40; // Y-coordinate for the barcode

    doc.image(barcodeBuffer1, barcodeX, barcodeY, { width: 120, height: 50 });

    doc.moveDown();
    doc.moveDown();

    const startX2 = 50;
    const startY2 = doc.y || 0;

    doc
      .rect(startX2 - 0, startY2 - 10, borderWidth, borderHeight) // Add padding around the text
      .stroke(); // Draw the border
    doc.moveDown();
    // COD and Product Details
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("COD", { align: "left", indent: 150 });
    doc
      .fontSize(18)
      .font("Helvetica")
      .text(`${orderData.paymentDetails.amount}`, {
        align: "left",
        indent: 155,
      });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`WEIGHT: ${orderData.packageDetails.applicableWeight}`, {
        align: "left",
        indent: 120,
      });
    doc.text(
      `Dimensions (cm): ${orderData.packageDetails.volumetricWeight.length}*${orderData.packageDetails.volumetricWeight.width}*${orderData.packageDetails.volumetricWeight.height}`,
      {
        align: "left",
        indent: 290,
      }
    );

    // Add the barcode to the right side of the section
    const barcodeX1 = 350; // X-coordinate for the barcode
    const barcodeY1 = doc.y - 80; // Y-coordinate for the barcode
    doc.image(barcodeBuffer2, barcodeX1, barcodeY1, { width: 150, height: 50 });
    doc.moveDown(4);
    let tableTop = doc.y - 40;
    let columnWidths = [50, 250, 30, 80, 100];

    const drawTableRow = (y, row) => {
      let x = 50;
      row.forEach((text, i) => {
        doc.text(text, x, y, { width: columnWidths[i], align: "center" });
        x += columnWidths[i];
      });
    };

    doc.font("Helvetica-Bold").fontSize(12);
    drawTableRow(tableTop, [
      "SKU",
      "Item Name",
      "Qty.",
      "Unit Price",
      "Total Amount",
    ]);

    // Draw top border
    doc
      .moveTo(50, tableTop - 5)
      .lineTo(550, tableTop - 5)
      .stroke();

    // Move down for first data row
    tableTop += 20;
    doc.font("Helvetica").fontSize(12);

    let tableData = orderData.productDetails.map((product, index) => {
      const totalPrice = product.quantity * product.unitPrice;

      return [
        product.sku,
        product.name, // Product Name
        product.quantity.toString(), // Quantity
        product.unitPrice, // Unit Price
        // product.sgst || "0.00", // SGST
        // product.cgst || "0.00", // CGST
        totalPrice, // Total
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

    doc.moveDown(1);

    const leftMargin = 50; // Define a consistent left margin
    doc.moveDown();
    doc.font("Helvetica-Bold").text(`Pickup Address:`, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(`${orderData.pickupAddress.contactName}`, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(`${orderData.pickupAddress.address}`, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(
        `${orderData.pickupAddress.city}, ${orderData.pickupAddress.state}, ${orderData.pickupAddress.pinCode}`,
        leftMargin,
        doc.y
      );
    doc
      .font("Helvetica")
      .text(
        `Mobile No: ${orderData.pickupAddress.phoneNumber}`,
        leftMargin,
        doc.y
      );

    doc.moveDown();
    doc.font("Helvetica-Bold").text(`Return Address:`, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(orderData.receiverAddress.contactName, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(`${orderData.receiverAddress.address}`, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(
        `${orderData.receiverAddress.city}, ${orderData.receiverAddress.state}, ${orderData.receiverAddress.pinCode}`,
        leftMargin,
        doc.y
      );
    doc
      .font("Helvetica")
      .text(
        `Mobile No: ${orderData.receiverAddress.phoneNumber}`,
        leftMargin,
        doc.y
      );

    // Ensure a gap after receiverAddress section
    doc.moveDown(2);

    // Draw a horizontal line for separation
    const lineStartX = 50;
    const lineWidth = 500;
    doc
      .moveTo(lineStartX, doc.y)
      .lineTo(lineStartX + lineWidth, doc.y)
      .stroke();

    // Move down for legal text
    doc.moveDown(1);
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        "This is a computer-generated document, hence does not require a signature.",
        { align: "left", width: 500 }
      );

    doc
      .text(
        "Note: All disputes are subject to Delhi jurisdiction. Goods once sold will only be taken back or exchanged as per",
        { align: "left", width: 500 }
      )
      .text("the store’s exchange/return policy.", {
        align: "left",
        width: 500,
      });

    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

module.exports = router;
