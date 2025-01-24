const express = require("express");
const PDFDocument = require("pdfkit");
// const Order = require("./printLabel.model");

const Order={
    "customerName": "Sachin Kumar",
    "address": "Main Bus Stand, Vpo Ismaila, 11B, Sampla, ROHTAK, Haryana, India - 124501",
    "mobile": "8607000463",
    "orderDate": "Dec 19, 2024",
    "invoiceNo": "1734587437",
    "amount": 700,
    "weight": "0.5 KG",
    "dimensions": "12 X 11 X 12",
    "sku": "Clothes",
    "itemName": "Clothes",
    "quantity": 1,
    "pickupAddress": "Rajat Kumar Funky House, Dadri Gate, Kount Road Bhiwani, Haryana, India - 127021",
    "pickupMobile": "7988477367"
  }
  

const router = express.Router();

// Route to generate PDF
router.get("/generate-pdf", async (req, res) => {
  try {
    // Fetch the first order (demo purpose)
    // const orderData = await Order.findOne();
    // console.log(orderData)
    const orderData=Order;
    if (!orderData) {
      return res.status(404).send("Order not found");
    }

    // Create a PDF document
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="shipping_label.pdf"`
    );

    // Generate PDF content
    doc.fontSize(14).text(`To: ${orderData.customerName}`, { align: "left" });
    doc.text(`Address: ${orderData.address}`);
    doc.text(`Mobile: ${orderData.mobile}`);
    doc.moveDown();

    doc.text(`Order Date: ${orderData.orderDate}`);
    doc.text(`Invoice No: ${orderData.invoiceNo}`);
    doc.text(`COD: ₹${orderData.amount}`);
    doc.text(`Weight: ${orderData.weight}`);
    doc.text(`Dimensions (cm): ${orderData.dimensions}`);
    doc.moveDown();

    doc.text(`SKU: ${orderData.sku}`);
    doc.text(`Item Name: ${orderData.itemName}`);
    doc.text(`Quantity: ${orderData.quantity}`);
    doc.text(`Total Amount: ₹${orderData.amount}`);
    doc.moveDown();

    doc.text("Pickup and Return Address:");
    doc.text(orderData.pickupAddress);
    doc.text(`Mobile No: ${orderData.pickupMobile}`);
    doc.moveDown();

    doc.text(
      "Note: This is a computer-generated document and does not require a signature."
    );

    // Pipe the PDF to the response
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

module.exports = router;
