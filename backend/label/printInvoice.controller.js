const express = require("express");
const PDFDocument = require("pdfkit");
const path = require("path"); // For resolving the image path

const router = express.Router();
router.use(express.json());

const invoiceDemo = {
  _id: "63bcd2f8e92f4700192f8a1d",
  invoiceNumber: "1736312705",
  invoiceDate: "Jan 08, 2025",
  customerName: "Ravi Yadav",
  billingAddress: "Main Road, Bus Stand, Vpo Chhillar, Rewari, Haryana, 123401",
  shippingAddress:
    "Main Road, Bus Stand, Vpo Chhillar, Rewari, Haryana, 123401",
  paymentMethod: "COD",
  AWB: "SF1544098244NIM",
  product: {
    name: "Shoes",
    sku: "SH12345",
    hsn: "640391",
    quantity: 1,
    unitPrice: 1100,
  },
  totalAmount: 1100,
  orderDate: "Feb 03, 2024",
  shipedBy: "Ravi Yadav",
};

router.get("/generate-invoice/:id", async (req, res) => {
  try {
    const invoice = invoiceDemo;

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Create the PDF document
    const pdfDoc = new PDFDocument({ margin: 30 });

    // Ensure response headers are set before piping
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="shipping_invoice.pdf"`
    );

    // Pipe the PDF output directly to the HTTP response
    pdfDoc.pipe(res);

    // Add PDF content
    // Add logo and heading

    pdfDoc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("TAX INVOICE", { align: "center" })
      .moveDown();

    const logoPath = path.join(__dirname, "./ECOMEXPRESS.png"); // Replace with the actual logo path
    pdfDoc
      .image(logoPath, 50, 80, { width: 50 }) // Add logo on the left
      // .fontSize(14)
      // .font("Helvetica-Bold")
      // .text("TAX INVOICE", 200, 50, { align: "left" }) // Add heading next to the logo
      .moveDown();
    pdfDoc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Invoice", { align: "right" });
    pdfDoc
      .fontSize(12)
      .font("Helvetica")
      .text(`Invoice Number: ${invoice.invoiceNumber}`, { align: "right" })
      .text(`Invoice Date: ${invoice.invoiceDate}`, { align: "right" })
      .moveDown()
      .moveDown();

    const startX = 30;
    const startY = pdfDoc.y;
    const borderWidth = 550;
    const borderHeight = 0.5;

    pdfDoc
      // .fillColor("#f0f0f0")
      .rect(startX, startY - 10, borderWidth, borderHeight)
      // .fillAndStroke("#f0f0f0", "#000000") // Add padding around the text
      .stroke() // Draw the border
      .moveDown();

    const leftColumnX = 30; // X-coordinate for "Bill To:"
    const rightColumnX = 400; // X-coordinate for "Sold By:"
    const rowY = pdfDoc.y; // Y-coordinate for the row (use current vertical position)
    const leftColumnWidth = 200; // Limit the width of the left column

    // "Bill To:" on the left with minimized width
    pdfDoc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Bill To:", leftColumnX, rowY, { width: leftColumnWidth })
      .font("Helvetica")
      .text(`${invoice.customerName}`, leftColumnX, pdfDoc.y, {
        width: leftColumnWidth,
      })
      .text(`${invoice.billingAddress}`, leftColumnX, pdfDoc.y, {
        width: leftColumnWidth,
      })
      .text("GST No:", leftColumnX, pdfDoc.y, { width: leftColumnWidth })
      .text("State code :123", leftColumnX, pdfDoc.y, {
        width: leftColumnWidth,
      });

    // "Sold By:" on the right
    pdfDoc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Sold By:", rightColumnX, rowY, { align: "right" })
      .font("Helvetica")
      .text("Rudra Enterprises", rightColumnX, pdfDoc.y, { align: "right" })
      .text(`${invoice.shippingAddress}`, rightColumnX, pdfDoc.y, {
        align: "right",
      })
      .text("State code: 123", rightColumnX, pdfDoc.y, { align: "right" });

    // Add details below "Bill To:"
    pdfDoc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Ship To:", leftColumnX, pdfDoc.y + 20)
      .font("Helvetica")
      .text("Ravi Yadav", leftColumnX, pdfDoc.y)
      .text(
        "Main Road, Bus Stand, Vpo Chhillar, Rewari, Haryana, 123401",
        leftColumnX,
        pdfDoc.y,
        { width: leftColumnWidth }
      );
    pdfDoc.moveDown();

    const leftColumnX1 = 30; // X-coordinate for "Bill To:"
    const rightColumnX1 = 400; // X-coordinate for "Sold By:"
    const rowY1 = pdfDoc.y; // Y-coordinate for the row (use current vertical position)
    const leftColumnWidth1 = 200; // Limit the width of the left column

    // "Payment method:" on the left with minimized width
    pdfDoc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`Payment Method: ${invoice.paymentMethod}`, leftColumnX1, rowY1, {
        width: leftColumnWidth1,
      })
      .font("Helvetica-Bold")
      .text(`AWB No: ${invoice.AWB}`, leftColumnX1, pdfDoc.y, {
        width: leftColumnWidth1,
      });
    pdfDoc.moveDown();

    // "order date:" on the right
    pdfDoc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`Order Date: ${invoice.orderDate}`, rightColumnX1, rowY1, {
        align: "right",
      })
      .font("Helvetica-Bold")
      .text(`Shipped By: ${invoice.shipedBy}`, rightColumnX1, pdfDoc.y, {
        align: "right",
      });
    pdfDoc.moveDown();

    // Create the Product Details table
    const tableStartY = pdfDoc.y + 10; // Position below the previous content
    const tableStartX = 12; // Left padding for the table
    const columnWidths = [85, 85, 55, 55, 100, 55, 45, 45, 65]; // Widths for each column

    const headerHeight = 30; // Height for the header
    const rowHeight = 40; // Increased row height for more space

    // Add table header background
    pdfDoc
      .rect(tableStartX, tableStartY, 590, headerHeight)
      .fillAndStroke("#d9d9d9", "#000");

    // Add table headers
    const headers = [
      "Product Name",
      "Product SKU",
      "HSN",
      "Quantity",
      "Unit Price",
      "TAX Amount",
      "CGST (Value %)",
      "SGST (Value %)",
      "TOTAL (Including GST)",
    ];
    headers.forEach((header, index) => {
      pdfDoc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#000")
        .text(
          header,
          tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          tableStartY + 3,
          {
            width: columnWidths[index],
            align: "center",
          }
        );
    });

    // Add product row below the header
    const productRowY = tableStartY + headerHeight; // Row directly below the header
    pdfDoc
      .rect(tableStartX, productRowY, 590, rowHeight)
      .fillAndStroke("#ffffff", "#000"); // White background with black border

    const productDetails = [
      invoice.product.name,
      invoice.product.sku,
      invoice.product.hsn,
      invoice.product.quantity,
      invoice.product.unitPrice,
      "0",
      "0",
      "0",
      invoice.totalAmount,
    ];

    productDetails.forEach((detail, index) => {
      pdfDoc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#000")
        .text(
          detail,
          tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          productRowY + rowHeight / 2 - 5, // Center the text vertically
          {
            width: columnWidths[index],
            align: "center",
          }
        );
    });

    // Add Charges Applied Section
    const chargesSectionY = productRowY + 20 + 40; // Gap after product row
    pdfDoc
      .rect(tableStartX, chargesSectionY, 550, 60)
      .fillAndStroke("#d9d9d9", "#000");

    // Add Charges Applied headers
    const chargesHeaders = [
      "Charges Applied",
      "Tax Amount",
      "CGST (Value %)",
      "SGST (Value %)",
      "TOTAL (Including GST)",
    ];
    const chargesColumnWidths = [150, 100, 100, 100, 100];

    chargesHeaders.forEach((header, index) => {
      pdfDoc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#000")
        .text(
          header,
          tableStartX +
            chargesColumnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          chargesSectionY + 5,
          {
            width: chargesColumnWidths[index],
            align: "center",
          }
        );
    });

    // Add Charges Applied row
    const chargesRowY = chargesSectionY + 20; // Below the headers
    const chargesDetails = ["Shipping Charges", "-", "-", "-", "-"];

    chargesDetails.forEach((detail, index) => {
      pdfDoc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#000")
        .text(
          detail,
          tableStartX +
            chargesColumnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          chargesRowY + 5,
          {
            width: chargesColumnWidths[index],
            align: "center",
          }
        );
    });

    // Add COD Charges row
    const codChargesRowY = chargesRowY + 20; // Below the Charges Applied row
    const codChargesDetails = ["COD Charges", "-", "-", "-", "-"];

    codChargesDetails.forEach((detail, index) => {
      pdfDoc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#000")
        .text(
          detail,
          tableStartX +
            chargesColumnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          codChargesRowY + 5,
          {
            width: chargesColumnWidths[index],
            align: "center",
          }
        );
    });

    // Add Total Amount row
    const totalAmountRowY = codChargesRowY + 20; // Below the COD Charges row
    pdfDoc
      .rect(tableStartX, totalAmountRowY, 550, 20)
      .fillAndStroke("#ffffff", "#000");

    pdfDoc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#000")
      .text("Total Amount", tableStartX, totalAmountRowY + 5, {
        width: chargesColumnWidths.slice(0, 4).reduce((a, b) => a + b, 0),
        align: "left",
      })
      .text(
        `Rs. ${invoice.totalAmount}`,
        tableStartX + 450,
        totalAmountRowY + 5,
        {
          width: chargesColumnWidths[4],
          align: "center",
        }
      );

    // End the PDF and close the stream
    pdfDoc.end();
  } catch (error) {
    // Catch any unexpected errors and log them
    console.error("Error generating PDF:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate invoice PDF" });
    }
  }
});

module.exports = router;
