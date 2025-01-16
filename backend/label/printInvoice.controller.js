const express = require("express");
const Invoice=require("./printInvoice.model")
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const{generateStyledInvoiceWithPages}=require("./InvoiceStyle");

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
      const selectedItems = req.headers['custom-data']
        ? JSON.parse(req.headers['custom-data'])
        : null;
  
      if (selectedItems==null) {
        return res.status(404).json({ message: "Invoice not found" });
      }
  
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="shipping_invoice.pdf"`
      );
  
      generateStyledInvoiceWithPages(selectedItems,res);
    } catch (error) {
      console.log(error);
      console.error("Error generating the invoice:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  module.exports=router