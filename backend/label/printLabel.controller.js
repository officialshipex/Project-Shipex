

const express = require("express");
const PDFDocument = require("pdfkit");
const bwipjs = require("bwip-js");
const Order = require("../models/newOrder.model");
const LabelSettings = require("./labelCustomize.model");

const router = express.Router();

router.get("/generate-pdf/:id", async (req, res) => {
  try {
    const orderData = await Order.findOne({ _id: req.params.id });
    const labelSettings = await LabelSettings.findOne({
      userId: orderData?.userId,
    });

    if (!orderData) {
      return res.status(404).send("Order not found");
    }

    // Barcodes
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
      includetext: false,
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

    // Draw border
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40).stroke();

    // Header: Receiver
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
    if (!labelSettings?.hideCustomerMobile || labelSettings == null) {
      doc.text(`MOBILE NO: ${orderData.receiverAddress.phoneNumber}`, {
        align: "left",
      });
    }

    // Logo if allowed
    if (
      (labelSettings?.showLogoOnLabel && labelSettings?.logoUrl) ||
      labelSettings == null
    ) {
      const imageX = doc.page.width - 200;
      const imageY = 50;
      const imageWidth = 100;

      const https = require("https");
      const getStreamBuffer = (url) =>
        new Promise((resolve, reject) => {
          https.get(url, (response) => {
            const chunks = [];
            response
              .on("data", (chunk) => chunks.push(chunk))
              .on("end", () => resolve(Buffer.concat(chunks)))
              .on("error", reject);
          });
        });

      try {
        const logoBuffer = await getStreamBuffer(labelSettings.logoUrl);
        doc.image(logoBuffer, imageX, imageY, { width: imageWidth });
      } catch (err) {
        console.error("Error loading logo image:", err.message);
      }
    }

    doc.moveDown();
    doc.rect(20, doc.y - 10, 555, 1).stroke();
    doc.moveDown();

    // Order Info
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Order Date: `, { continued: true });
    doc.font("Helvetica").text(formattedOrderDate1);
    doc.font("Helvetica-Bold").text(`Invoice No: `, { continued: true });
    doc.font("Helvetica").text(orderData.orderId);

    // Order barcode
    const barcodeX = 380;
    const barcodeY = doc.y - 40;
    if (!labelSettings?.hideOrderBarcode) {
      doc.image(barcodeBuffer1, barcodeX, barcodeY, { width: 120, height: 50 });
    }

    doc.moveDown(2);
    doc.rect(20, doc.y - 10, 555, 1).stroke();
    doc.moveDown(2);

    // Payment and Amount
    const paymentText =
      orderData.paymentDetails.method === "COD" ? "COD" : "PREPAID";

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("MODE: ", 30, doc.y, { continued: true })
      .font("Helvetica")
      .text(paymentText);

    if (
      !labelSettings?.productDetails.hideOrderAmount ||
      labelSettings == null
    ) {
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("AMOUNT: ", 30, doc.y, { continued: true })
        .font("Helvetica")
        .text(`${orderData.paymentDetails.amount}`);
      doc.moveDown();
    }

    // Weight & Dimensions
    doc
      .fontSize(12)
      .text(`WEIGHT: ${orderData.packageDetails.applicableWeight}`, {
        align: "left",
      });
    doc.text(
      `Dimensions (cm): ${orderData.packageDetails.volumetricWeight.length}*${orderData.packageDetails.volumetricWeight.width}*${orderData.packageDetails.volumetricWeight.height}`,
      { align: "left" }
    );

    // ----------- Set a fixed y for the right-side barcode section:
    const rightBlockY = 240; // Adjust this to match your preferred layout

    const barcodeX1 = 320; // right side (you can tweak X too)
    const courierServiceText = orderData.courierServiceName || "N/A";
    const textWidth = doc.widthOfString(courierServiceText);
    const textX = barcodeX1 + (200 - textWidth) / 2;

    doc
      .font("Helvetica-Bold")
      .text(courierServiceText, textX, rightBlockY - 20);
    doc.image(barcodeBuffer2, barcodeX1, rightBlockY, {
      width: 200,
      height: 50,
    });

    const textWidth1 = doc.widthOfString(orderData.awb_number);
    const textX1 = barcodeX1 + (200 - textWidth1) / 2;
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(orderData.awb_number, textX1, rightBlockY + 55);

    // ----------- Restore doc.y for remaining content:
    doc.y = Math.max(doc.y, rightBlockY + 75);

    // Now the rest of your content can resume below this section as usual

    doc.moveDown(2);

    // ======= Dynamic Table Section =======
    // Dynamically build columns and headers
    const columns = [];
    if (!labelSettings?.productDetails.hideSKU || labelSettings == null)
      columns.push({ key: "sku", title: "SKU", width: 90 });
    if (!labelSettings?.productDetails.hideProduct || labelSettings == null)
      columns.push({ key: "name", title: "Item Name", width: 220 });
    if (!labelSettings?.productDetails.hideQty || labelSettings == null)
      columns.push({ key: "quantity", title: "Qty.", width: 40 });
    if (!labelSettings?.productDetails.hideOrderAmount || labelSettings == null)
      columns.push({ key: "unitPrice", title: "Unit Price", width: 100 });
    if (!labelSettings?.productDetails.hideTotalAmount || labelSettings == null)
      columns.push({ key: "totalAmount", title: "Total Amount", width: 100 });

    // Adjust last column width so table fills full width to right margin
    const tableLeft = 20;
    const tableRight = 575;

    if (columns.length > 0) {
      const totalFixedWidth = columns
        .slice(0, -1)
        .reduce((sum, col) => sum + col.width, 0);
      columns[columns.length - 1].width =
        tableRight - tableLeft - totalFixedWidth;
    }

    const hasTable = columns.length > 0;

    if (hasTable && orderData.productDetails.length > 0) {
      // Table positions
      let tableTop = doc.y;
      let tableLeft = 20;
      let rowHeight = 20;

      // Table Header Background & Borders
      let x = tableLeft;
      columns.forEach((col) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(col.title, x + 5, tableTop + 5, { width: col.width - 10 });
        x += col.width;
      });
      // Borders
      doc
        .moveTo(tableLeft, tableTop)
        .lineTo(
          tableLeft + columns.reduce((sum, col) => sum + col.width, 0),
          tableTop
        )
        .stroke();
      doc
        .moveTo(tableLeft, tableTop + rowHeight)
        .lineTo(
          tableLeft + columns.reduce((sum, col) => sum + col.width, 0),
          tableTop + rowHeight
        )
        .stroke();

      // Draw vertical borders
      x = tableLeft;
      columns.forEach((col) => {
        doc
          .moveTo(x, tableTop)
          .lineTo(
            x,
            tableTop + rowHeight + orderData.productDetails.length * rowHeight
          )
          .stroke();
        x += col.width;
      });
      // Right border
      doc
        .moveTo(x, tableTop)
        .lineTo(
          x,
          tableTop + rowHeight + orderData.productDetails.length * rowHeight
        )
        .stroke();

      // Draw bottom border after all rows
      const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
      const bottomY =
        tableTop + rowHeight + orderData.productDetails.length * rowHeight;
      doc
        .moveTo(tableLeft, bottomY)
        .lineTo(tableLeft + tableWidth, bottomY)
        .stroke();

      // Rows
      orderData.productDetails.forEach((product, i) => {
        let y = tableTop + rowHeight + i * rowHeight;
        x = tableLeft;
        columns.forEach((col) => {
          let value;
          if (col.key === "totalAmount") {
            value = (product.quantity * product.unitPrice).toString();
          } else {
            value = product[col.key]?.toString() ?? "";
          }
          doc
            .font("Helvetica")
            .fontSize(12)
            .text(value, x + 5, y + 5, { width: col.width - 10 });
          x += col.width;
        });
      });
      doc.moveDown(2);
    }
    // ======= END Table Section =======

    // Pickup Address
    const showPickupName =
      !labelSettings?.warehouseSettings?.hidePickupName ||
      labelSettings == null;
    const showPickupAddress =
      !labelSettings?.warehouseSettings?.hidePickupAddress ||
      labelSettings == null;
    const showPickupMobile =
      !labelSettings?.warehouseSettings?.hidePickupMobile ||
      labelSettings == null;
    const leftMargin = 30;
    if (showPickupName || showPickupAddress || showPickupMobile) {
      doc.moveDown();
      doc.font("Helvetica-Bold").text(`Pickup Address:`, leftMargin, doc.y);
      if (showPickupName) {
        doc
          .font("Helvetica")
          .text(`${orderData.pickupAddress.contactName}`, leftMargin, doc.y);
      }
      if (showPickupAddress) {
        doc.text(`${orderData.pickupAddress.address}`, leftMargin, doc.y);
        doc.text(
          `${orderData.pickupAddress.city}, ${orderData.pickupAddress.state}, ${orderData.pickupAddress.pinCode}`,
          leftMargin,
          doc.y
        );
      }
      if (showPickupMobile) {
        doc.text(
          `Mobile No: ${orderData.pickupAddress.phoneNumber}`,
          leftMargin,
          doc.y
        );
      }
    }

    // Return Address
    const showRTOName =
      !labelSettings?.warehouseSettings?.hideRTOName || labelSettings == null;
    const showRTOAddress =
      !labelSettings?.warehouseSettings?.hideRTOAddress ||
      labelSettings == null;
    const showRTOMobile =
      !labelSettings?.warehouseSettings?.hideRTOMobile || labelSettings == null;
    if (showRTOName || showRTOAddress || showRTOMobile) {
      doc.moveDown();
      doc.font("Helvetica-Bold").text(`Return Address:`, leftMargin, doc.y);
      if (showRTOName) {
        doc
          .font("Helvetica")
          .text(orderData.pickupAddress.contactName, leftMargin, doc.y);
      }
      if (showRTOAddress) {
        doc.text(`${orderData.pickupAddress.address}`, leftMargin, doc.y);
        doc.text(
          `${orderData.pickupAddress.city}, ${orderData.pickupAddress.state}, ${orderData.pickupAddress.pinCode}`,
          leftMargin,
          doc.y
        );
      }
      if (showRTOMobile) {
        doc.text(
          `Mobile No: ${orderData.pickupAddress.phoneNumber}`,
          leftMargin,
          doc.y
        );
      }
    }

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
