const express = require("express");
const Invoice=require("./printInvoice.model")
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const router = express.Router();
router.use(express.json());

const invoiceDemo={
    "_id": "63bcd2f8e92f4700192f8a1d",
    "invoiceNumber": "1736312705",
    "invoiceDate": "Jan 08, 2025",
    "customerName": "Ravi Yadav",
    "billingAddress": "Main Road, Bus Stand, Vpo Chhillar, Rewari, Haryana, 123401",
    "shippingAddress": "Main Road, Bus Stand, Vpo Chhillar, Rewari, Haryana, 123401",
    "paymentMethod": "COD",
    "AWB": "SF1544098244NIM",
    "product": {
      "name": "Shoes",
      "sku": "SH12345",
      "hsn": "640391",
      "quantity": 1,
      "unitPrice": 1100
    },
    "totalAmount": 1100
  }
  

router.get("/generate-invoice/:id", async (req, res) => {
    try {
    //   const invoice = await Invoice.findById(req.params.id);
    const invoice=invoiceDemo;
  
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
  
      // Create PDF
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type","application/pdf");
      res.setHeader("Content-Disposition",`attachment; filename="shipping_invoice.pdf"`);
    //   const filePath = path.join(__dirname, `invoice_${invoice.invoiceNumber}.pdf`);
  
    //   pdfDoc.pipe(fs.createWriteStream(filePath));
  
      // Add content to PDF
      pdfDoc
        .fontSize(20)
        .text("TAX INVOICE", { align: "center" })
        .moveDown();
  
      pdfDoc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
      pdfDoc.text(`Invoice Date: ${invoice.invoiceDate}`);
      pdfDoc.text(`Order Date: ${invoice.invoiceDate}`);
      pdfDoc.text(`Payment Method: ${invoice.paymentMethod}`);
      pdfDoc.text(`AWB: ${invoice.AWB}`);
      pdfDoc.moveDown();
  
      pdfDoc.text(`Bill To:`);
      pdfDoc.text(invoice.billingAddress);
      pdfDoc.moveDown();
  
      pdfDoc.text(`Ship To:`);
      pdfDoc.text(invoice.shippingAddress);
      pdfDoc.moveDown();
  
      pdfDoc.text(`Product Details:`);
      pdfDoc.text(`Name: ${invoice.product.name}`);
      pdfDoc.text(`Quantity: ${invoice.product.quantity}`);
      pdfDoc.text(`Unit Price: Rs. ${invoice.product.unitPrice}`);
      pdfDoc.text(`Total Amount: Rs. ${invoice.totalAmount}`);
      pdfDoc.end();
  
      pdfDoc.pipe(res);
    
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports=router