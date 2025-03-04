const express = require("express");
const PDFDocument = require("pdfkit");
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
      bcid: "code128",
      text: String(orderData.orderId),
      scale: 3,
      height: 10,
      includetext: true,
      textyoffset: 5,
      textxalign: "center",
    });

    const barcodeBuffer2 = await bwipjs.toBuffer({
      bcid: "code128",
      text: String(orderData.awb_number),
      scale: 6,
      height: 40,
      includetext: false, // Hide barcode text from bwip-js
    });

    const options1 = { year: "numeric", month: "short", day: "numeric" };
    const formattedOrderDate1 = orderData.createdAt.toLocaleDateString(
      "en-US",
      options1
    );

    const doc = new PDFDocument({ size: "A4", margin: 30 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="shipping_label.pdf"`
    );

    // **Draw full-page border**
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40).stroke();

    // **Header Section**
    doc.fontSize(16).font("Helvetica-Bold").text(`To:`, { align: "left" });
    doc
      .fontSize(14)
      .font("Helvetica")
      .text(orderData.receiverAddress.contactName, { align: "left" });
    doc.text(`${orderData.receiverAddress.address}`, {
      align: "left",
      width: 300,
    });
    doc.text(
      `${orderData.receiverAddress.city}, ${orderData.receiverAddress.state}, ${orderData.receiverAddress.pinCode}`,
      { align: "left" }
    );
    doc.text(`MOBILE NO: ${orderData.receiverAddress.phoneNumber}`, {
      align: "left",
    });

    doc.moveDown();
    doc.rect(20, doc.y - 10, 555, 1).stroke();
    doc.moveDown();

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Order Date: `, { continued: true });
    doc.font("Helvetica").text(formattedOrderDate1);
    doc.font("Helvetica-Bold").text(`Invoice No: `, { continued: true });
    doc.font("Helvetica").text(orderData.orderId);

    const barcodeX = 380;
    const barcodeY = doc.y - 40;
    doc.image(barcodeBuffer1, barcodeX, barcodeY, { width: 120, height: 50 });

    doc.moveDown(2);
    doc.rect(20, doc.y - 10, 555, 1).stroke();
    doc.moveDown(2);

    const paymentText =
      orderData.paymentDetails.method === "COD" ? "COD" : "PREPAID";

      doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("MODE: ", 30, doc.y, { continued: true }) // Keep on same line
      .font("Helvetica")
      .text(paymentText);
    
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("AMOUNT: ", 30, doc.y, { continued: true }) // Keep on same line
      .font("Helvetica")
      .text(`${orderData.paymentDetails.amount}`);
      doc.moveDown();

    doc
      .fontSize(12)
      .text(`WEIGHT: ${orderData.packageDetails.applicableWeight}`, {
        align: "left",
        // indent: 30,
      });
    doc.text(
      `Dimensions (cm): ${orderData.packageDetails.volumetricWeight.length}*${orderData.packageDetails.volumetricWeight.width}*${orderData.packageDetails.volumetricWeight.height}`,
      { align: "left" }
    );

    const barcodeX1 = 320;
    const barcodeY1 = doc.y - 80;
    const currentY = doc.y;

    // Get text width for centering
    const courierServiceText = orderData.courierServiceName || "N/A";
    const textWidth = doc.widthOfString(courierServiceText);
    const textX = barcodeX1 + (200 - textWidth) / 2; // Center it above barcode

    doc.font("Helvetica-Bold").text(courierServiceText, textX, barcodeY1 - 20);
    doc.image(barcodeBuffer2, barcodeX1, barcodeY1, { width: 200, height: 50 });

    // Add bold text below barcode
    // Draw centered bold text
    const textWidth1 = doc.widthOfString(orderData.awb_number);
    const textX1 = barcodeX1 + (200 - textWidth1) / 2; // Center it above barcode
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(orderData.awb_number, textX1, barcodeY1 + 55);

    doc.y = currentY;

    doc.moveDown(2);

    // **Table Header**
    let tableTop = doc.y;
    let tableLeft = 20;
    let tableRight = 575;
    let rowHeight = 20;
    let columnWidths = [90, 220, 40, 100, 100]; // Adjusted column widths for proper alignment

    const drawTableBorders = (x, y, width, height) => {
      doc.rect(x, y, width, height).stroke();
    };

    // **Draw Table Borders (Top and Bottom)**
    drawTableBorders(
      tableLeft,
      tableTop,
      tableRight - tableLeft,
      rowHeight + orderData.productDetails.length * rowHeight + 10
    );

    // **Draw Table Header**
    doc.font("Helvetica-Bold").fontSize(12);
    drawTableBorders(tableLeft, tableTop, tableRight - tableLeft, rowHeight); // Header border
    doc.text("SKU", tableLeft + 5, tableTop + 5);
    doc.text("Item Name", tableLeft + 95, tableTop + 5);
    doc.text("Qty.", tableLeft + 315, tableTop + 5);
    doc.text("Unit Price", tableLeft + 355, tableTop + 5);
    doc.text("Total Amount", tableLeft + 455, tableTop + 5);

    // **Draw Vertical Column Borders**
    let xPos = tableLeft;
    columnWidths.forEach((width) => {
      doc
        .moveTo(xPos, tableTop)
        .lineTo(
          xPos,
          tableTop +
            rowHeight +
            orderData.productDetails.length * rowHeight +
            10
        )
        .stroke();
      xPos += width;
    });

    // **Table Rows**
    tableTop += rowHeight;
    doc.font("Helvetica").fontSize(12);

    orderData.productDetails.forEach((product, i) => {
      let yPosition = tableTop + i * rowHeight;

      doc.text(product.sku, tableLeft + 5, yPosition + 5);
      doc.text(product.name, tableLeft + 95, yPosition + 5, {
        width: 240,
        ellipsis: true,
      });
      doc.text(product.quantity.toString(), tableLeft + 315, yPosition + 5);
      doc.text(product.unitPrice.toString(), tableLeft + 355, yPosition + 5);
      doc.text(
        (product.quantity * product.unitPrice).toString(),
        tableLeft + 455,
        yPosition + 5
      );

      // Draw row border
      // drawTableBorders(tableLeft, yPosition, tableRight - tableLeft, rowHeight);
    });

    // **Draw Right Border**
    doc
      .moveTo(tableRight, tableTop - rowHeight)
      .lineTo(
        tableRight,
        tableTop + orderData.productDetails.length * rowHeight
      )
      .stroke();

    doc.moveDown(1);
    const leftMargin = 30;
    doc.moveDown();
    doc.font("Helvetica-Bold").text(`Pickup Address:`, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(`${orderData.pickupAddress.contactName}`, leftMargin, doc.y);
    doc.text(`${orderData.pickupAddress.address}`, leftMargin, doc.y);
    doc.text(
      `${orderData.pickupAddress.city}, ${orderData.pickupAddress.state}, ${orderData.pickupAddress.pinCode}`,
      leftMargin,
      doc.y
    );
    doc.text(
      `Mobile No: ${orderData.pickupAddress.phoneNumber}`,
      leftMargin,
      doc.y
    );

    doc.moveDown();
    doc.font("Helvetica-Bold").text(`Return Address:`, leftMargin, doc.y);
    doc
      .font("Helvetica")
      .text(orderData.pickupAddress.contactName, leftMargin, doc.y);
    doc.text(`${orderData.pickupAddress.address}`, leftMargin, doc.y);
    doc.text(
      `${orderData.pickupAddress.city}, ${orderData.pickupAddress.state}, ${orderData.pickupAddress.pinCode}`,
      leftMargin,
      doc.y
    );
    doc.text(
      `Mobile No: ${orderData.pickupAddress.phoneNumber}`,
      leftMargin,
      doc.y
    );

    doc.moveDown(2);
    doc.moveTo(20, doc.y).lineTo(575, doc.y).stroke();
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
