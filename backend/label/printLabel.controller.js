const express = require("express");
const PDFDocument = require("pdfkit");
const LabelSetting = require("./label.model");
const bwipjs = require("bwip-js");



const Order = {
  customerName: "Sachin Kumar",
  address:
    "Main Bus Stand, Vpo Ismaila, 11B, Sampla, ROHTAK, Haryana, India - 124501",
  mobile: "8607000463",
  orderDate: "Dec 19, 2024",
  invoiceNo: "1734587437",
  amount: 700,
  weight: "0.5 KG",
  dimensions: "12 X 11 X 12",
  sku: "Clothes",
  itemName: "Clothes",
  quantity: 1,
  pickupAddress:
    "Rajat Kumar Funky House, Dadri Gate, Kount Road Bhiwani, Haryana, India - 127021",
  pickupMobile: "7988477367",
  rtoAddress:
    "Rajat Kumar Funky House, Dadri Gate, Kount Road Bhiwani, Haryana, India - 127021",
  rtoMobileNo: "7988477367",
  gstNo: "2134",
  pickupContactName: "bijay",
  rtoContactName: "bijay",
  discountAmount: 200,
};

const router = express.Router();

router.get("/generate-pdf", async (req, res) => {
  try {
    // console.log("I am being called");
    const orderData = Order;
    if (!orderData) {
      return res.status(404).send("Order not found");
    }

    const user_id = "67237ee56a42044404423c8e";
    const settings = await LabelSetting.findOne({ user: user_id });

    if (!settings) {
      return res.status(404).send("Label settings not found");
    }
    // Barcode generation
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: orderData.invoiceNo, // Text to encode
      scale: 3, // Scale factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center", // Center-align the text
    });

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
      .text(orderData.customerName, { align: "left" });
    doc.text(orderData.address, { align: "left" });
    if (!settings.customerSetting.hidePhoneNumber) {
      doc.text(`MOBILE NO: ${orderData.mobile}`, { align: "left" });
    }
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
    doc.font("Helvetica").text(orderData.orderDate);
    doc.font("Helvetica-Bold").text(`Invoice No: `, { continued: true });
    doc.font("Helvetica").text(orderData.invoiceNo);

    const barcodeX = 380; // X-coordinate for the barcode
    const barcodeY = doc.y - 40; // Y-coordinate for the barcode
    if (!settings.customerSetting.hideOrderBarcode) {
      doc.image(barcodeBuffer, barcodeX, barcodeY, { width: 150, height: 50 });
    }
    doc.moveDown();
    doc.moveDown();

    const startX2 = 50;
    const startY2 = doc.y || 0;
    // const borderWidth = 500;
    // const borderHeight = 1;
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
      .text(`${orderData.amount}`, { align: "left", indent: 155 });
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`WEIGHT: ${orderData.weight}`, { align: "left", indent: 120 });
    doc.text(`Dimensions (cm): ${orderData.dimensions}`, {
      align: "left",
      indent: 290,
    });

    // Add the barcode to the right side of the section
    const barcodeX1 = 350; // X-coordinate for the barcode
    const barcodeY1 = doc.y - 80; // Y-coordinate for the barcode
    doc.image(barcodeBuffer, barcodeX1, barcodeY1, { width: 150, height: 50 });

    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();

    const startX3 = 50;
    const startY3 = doc.y - 40;
    doc

      .rect(startX3 - 0, startY3 - 10, borderWidth, borderHeight) // Add padding around the text
      .stroke(); // Draw the border
    doc.moveDown();

    const fixedTableWidth = 500; // Set a fixed table width

    // Headers and visible columns logic
    const headers = [
      { label: "SKU", key: "SKU", visible: !settings.productDetails.hideSKU },
      {
        label: "Item Name",
        key: "Item Name",
        visible: !settings.productDetails.hideProduct,
      },
      { label: "Qty.", key: "Qty.", visible: !settings.productDetails.hideQTY },
      {
        label: "Total Amount",
        key: "Total Amount",
        visible: !settings.productDetails.hideTotalAmount,
      },
      {
        label: "Discount Amount",
        key: "Discount Amount",
        visible: !settings.productDetails.hideDiscountAmount,
      },
    ];

    // Filter out headers that are not visible
    const visibleHeaders = headers.filter((header) => header.visible);

    // Calculate the width for each visible column
    const colWidth = fixedTableWidth / visibleHeaders.length;

    // Example data rows
    const rows = [
      {
        SKU: "SKU1",
        "Item Name": "Item 1",
        "Qty.": 2,
        "Total Amount": 500,
        "Discount Amount": 50,
      },
      {
        SKU: "SKU2",
        "Item Name": "Item 2",
        "Qty.": 3,
        "Total Amount": 700,
        "Discount Amount": 100,
      },
    ];

    // Filter rows to match visible headers
    const filteredRows = rows.map((row) =>
      visibleHeaders.map((header) => row[header.key] || "")
    );

    const startX4 = 50; // Starting X coordinate for the table
    const startY4 = 320; // Starting Y coordinate for the table
    const rowHeight = 35; // Row height

    // Draw table headers
    visibleHeaders.forEach((header, i) => {
      const x = startX4 + colWidth * i; // Adjust X coordinate for each column
      doc.rect(x, startY4, colWidth, rowHeight).stroke();
      doc.text(header.label, x + 5, startY4 + 10);
    });

    // Draw table rows
    filteredRows.forEach((row, rowIndex) => {
      const y = startY4 + rowHeight * (rowIndex + 1);
      row.forEach((cell, colIndex) => {
        const x = startX4 + colWidth * colIndex; // Adjust X coordinate for each column
        doc.rect(x, y, colWidth, rowHeight).stroke();
        doc.text(cell, x + 5, y + 10);
      });
    });

    doc.moveDown();
    // Add Pickup Address
    doc
      .moveDown()
      .font("Helvetica-Bold")
      .text(`Pickup Address:`, { align: "left", indent: -405 });

    if (!settings.wareHouseSetting.hidePickupContactName) {
      doc.font("Helvetica").text("bijay", { indent: -405 });
    }
    // .text(orderData.pickupAddress, { indent: -345 })
    // .text(`Mobile No: ${orderData.pickupMobile}`, { indent: -345 })

    if (!settings.wareHouseSetting.hidePickupAddress) {
      doc.font("Helvetica").text(orderData.pickupAddress, { indent: -405 });
    }

    if (!settings.wareHouseSetting.hidePickupPhoneNumber) {
      doc
        .font("Helvetica")
        .text(`Mobile No: ${orderData.pickupMobile}`, { indent: -405 });
    }
    if (!settings.wareHouseSetting.hideGstNumber) {
      doc
        .font("Helvetica")
        .text(`GST No: ${orderData.gstNo}`, { indent: -405 });
    }

    // Add Return Address
    doc
      .moveDown()
      .font("Helvetica-Bold")
      .text(`Return Address:`, { align: "left", indent: -405 });

    if (!settings.wareHouseSetting.hideRtoContactName) {
      doc.font("Helvetica").text(orderData.rtoContactName, { indent: -405 });
    }

    if (!settings.wareHouseSetting.hideRtoAddress) {
      doc.font("Helvetica").text(orderData.rtoAddress, { indent: -405 });
    }

    if (!settings.wareHouseSetting.hideRtoPhoneNumber) {
      doc.font("Helvetica").text(orderData.rtoMobileNo, { indent: -405 });
    }

    // doc
    //   .font("Helvetica")
    //   .text("bijay", { indent: -345 })
    //   .text(orderData.pickupAddress, { indent: -345 })
    //   .text(`Mobile No: ${orderData.pickupMobile}`, { indent: -345 })
    //   .moveDown();

    // Footer
    doc
      .moveDown()
      .font("Helvetica")
      .fontSize(10)
      .text(
        "This is a computer-generated document, hence does not require a signature.",
        { align: "left", indent: -405 }
      );
    doc
      .text(
        "Note: All disputes are subject to Delhi jurisdiction. Goods once sold will only be taken back or exchanged as per",
        { align: "left", indent: -405 }
      )
      .text("the store’s exchange/return policy.", {
        align: "left",
        indent: -405,
      });

    // Pipe PDF to response
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

module.exports = router;
