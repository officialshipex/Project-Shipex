const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const File = require("../model/bulkOrderFiles.model.js");
const bulkOrdersExcel = require("../model/bulkOrdersExcel.model.js");
const bulkOrdersCSV = require("../model/bulkOrderCSV.model.js");
const { bulkOrderCSVvalidationSchema,bulkOrderExcelValidationSchema } = require("../utils/bulkOrderValidation.js");
const path = require("path");

// Helper function to read CSV file and store in database
function parseCSV(filePath, fileData) {
  return new Promise((resolve, reject) => {
    let validCount = 0;
    let rejectedCount = 0;

    const orders = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        // orders.push(row);
        try {
          // Normalize the 'Send Notification' field to lowercase
          if (row["Send Notification(True/False)"]) {
            row["Send Notification(True/False)"] = row["Send Notification(True/False)"].trim().toLowerCase();
          }

          const { error } = bulkOrderCSVvalidationSchema.validate(row, { abortEarly: false,});

          if (error) {
            console.error(`Validation errors for order ${row["*Order Id"]}:`,
              error.details.map((err) => err.message).join(", ")
            );
            rejectedCount++;
            return; // Skip this row if validation fails
          }

          const order = new bulkOrdersCSV({
            fileId: fileData._id,
            orderId: row["*Order Id"],
            orderDate: row["Order Date as dd-mm-yyyy hh:MM"] || null,
            channel: row["*Channel"],
            paymentMethod: row["*Payment Method(COD/Prepaid)"],
            customer: {
              firstName: row["*Customer First Name"],
              lastName: row["Customer Last Name"] || "",
              email: row["Email (Optional)"] || "",
              mobile: row["*Customer Mobile"],
              alternateMobile: row["Customer Alternate Mobile"] || "",
            },
            shippingAddress: {
              line1: row["*Shipping Address Line 1"],
              line2: row["Shipping Address Line 2"] || "",
              country: row["*Shipping Address Country"],
              state: row["*Shipping Address State"],
              city: row["*Shipping Address City"],
              postcode: row["*Shipping Address Postcode"],
            },
            billingAddress: {
              line1: row["Billing Address Line 1"] || "",
              line2: row["Billing Address Line 2"] || "",
              country: row["Billing Address Country"] || "",
              state: row["Billing Address State"] || "",
              city: row["Billing Address City"] || "",
              postcode: row["Billing Address Postcode"] || "",
            },
            orderDetails: {
              masterSKU: row["*Master SKU"],
              name: row["*Product Name"],
              quantity: parseInt(row["*Product Quantity"]) || 0,
              taxPercentage: parseFloat(row["Tax %"]),
              sellingPrice: parseFloat(
                row["*Selling Price(Per Unit Item, Inclusive of Tax)"]
              ),
              discount: parseFloat(row["Discount(Per Unit Item)"]) || 0,
              shippingCharges: parseFloat(
                row["Shipping Charges(Per Order)"] || 0
              ),
              codCharges: parseFloat(row["COD Charges(Per Order)"] || 0),
              giftWrapCharges: parseFloat(
                row["Gift Wrap Charges(Per Order)"] || 0
              ),
              totalDiscount: parseFloat(row["Total Discount (Per Order)"] || 0),
              dimensions: {
                length: parseFloat(row["*Length (cm)"]),
                breadth: parseFloat(row["*Breadth (cm)"]),
                height: parseFloat(row["*Height (cm)"]),
              },
              weight: parseFloat(row["*Weight Of Shipment(kg)"]),
            },
            sendNotification: row["Send Notification(True/False)"] === "true",
            comment: row["Comment"] || "",
            hsnCode: row["HSN Code"] || "",
            locationId: row["Location Id"] || "",
            resellerName: row["Reseller Name"] || "",
            companyName: row["Company Name"] || "",
            latitude: parseFloat(row["latitude"] || 0),
            longitude: parseFloat(row["longitude"] || 0),
            verifiedOrder: row["Verified Order"] === "1",
            isDocuments: row["Is documents"] || "No",
            orderType: row["Order Type"] || "",
            orderTag: row["Order tag"] || "",
          });
          validCount++;
          await order.save();
          console.log(`Imported order: ${order.orderId}`);
        } catch (error) {
          console.error(`Error importing order: ${row["*Order Id"]}`, error);
        }
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        console.log(`Total valid orders stored: ${validCount}`);
        console.log(`Total rejected orders: ${rejectedCount}`);
        resolve({ validCount, rejectedCount, orders });
      })
      .on("error", (error) => {
        console.log("CSV Parsing error:", error);
        reject(error);
      });
  });
}

// Helper function to read Excel file (.xlsx, .xls)
function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  return data;
}

// Controller function to handle file upload and order processing
const bulkOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save file metadata
    const fileData = new File({
      filename: req.file.filename,
      date: new Date(),
      status: "Processing",
    });
    await fileData.save();

    // Determine the file extension
    const fileExtension = path.extname(req.file.path).toLowerCase();
    console.log("fileextension:", fileExtension);
    let orders = [];

    // Parse the file based on its extension
    if (fileExtension === ".csv") {
      await parseCSV(req.file.path, fileData);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      orders = parseExcel(req.file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    // Ensure all fields are strings before validation
    orders.forEach(order => {
      order["*Buyer's Mobile No."] = String(order["*Buyer's Mobile No."] || '');
      order['*Shipping Address Pincode'] = String(order['*Shipping Address Pincode'] || '');
      order["Buyer's Alternate Mobile Number (Optional)"] = String(order["Buyer's Alternate Mobile Number (Optional)"] || '');
      order['Billing Pincode (Optional)'] = String(order['Billing Pincode (Optional)'] || '');
      order['Pickup Address Id (Optional)'] = String(order['Pickup Address Id (Optional)'] || '');
      order['HSN Code (Optional)'] = String(order['HSN Code (Optional)'] || '');
      order['Courier ID (Optional)'] = String(order['Courier ID (Optional)'] || '');
    });

    // Validate and map parsed data to Order model format
    const orderDocs = [];
    let validCount = 0;
    let rejectedCount = 0;

    for (const row of orders) {
      const { error } = bulkOrderExcelValidationSchema.validate(row, {
        abortEarly: false,
      });
      if (error) {
        console.error(
          `Validation errors for order ${row["*Order Id"]}:`,
          error.details.map((err) => err.message).join(", ")
        );
        rejectedCount++;
        continue; // Skip invalid rows
      }
      
      orderDocs.push({
        fileId: fileData._id,
        orderId: row["*Order Id"] || "",
        orderDate: row["Order Date (DD-MM-YYYY) (Optional)"] || "",
        verifiedOrder: row["Verified Order (Yes/No) (Optional)"] === "Yes",
        buyer: {
          mobileNo: row["*Buyer's Mobile No."] || "",
          firstName: row["*Buyer's First Name"] || "",
          lastName: row["Buyer's Last Name (Optional)"] || "",
          email: row["Email (Optional)"] || "",
          alternatePhone:
            row["Buyer's Alternate Mobile Number (Optional)"] || "",
          companyName: row["Buyer's Company Name (Optional)"] || "",
          gstin: row["Buyer's GSTIN (Optional)"] || "",
        },
        shippingAddress: {
          completeAddress: row["*Shipping Complete Address"] || "",
          landmark: row["Shipping Address Landmark (Optional)"],
          pincode: row["*Shipping Address Pincode"] || "",
          city: row["*Shipping Address City"] || "",
          state: row["*Shipping Address State"] || "",
          country: row["*Shipping Address Country"] || "",
        },
        billingAddress: {
          completeAddress: row["Billing Complete Address (Optional)"],
          landmark: row["Billing Landmark (Optional)"],
          pincode: row["Billing Pincode (Optional)"],
          city: row["Billing City (Optional)"],
          state: row["Billing State (Optional)"],
          country: row["Billing Country (Optional)"],
        },
        orderDetails: {
          orderChannel: row["*Order Channel"] || "",
          paymentMethod: row["*Payment Method (COD/Prepaid)"] || "",
          productName: row["*Product Name"] || "",
          masterSKU: row["*Master SKU"] || "",
          quantity: parseInt(row["*Product Quantity"] || 0),
          unitPrice: parseFloat(
            row["*Per Unit Price in INR (Inclusive of Tax)"] || 0
          ),
          productDiscount: parseFloat(
            row["Product Discount (Per Unit Item) (Optional)"] || 0
          ),
          hsnCode: row["HSN Code (Optional)"],
          taxRate: parseFloat(row["Tax Rate(percentage) (Optional)"] || 0),
          shippingCharges: parseFloat(
            row["Shipping Charges (Per Order) (Optional)"] || 0
          ),
          giftWrapCharges: parseFloat(
            row["Gift Wrap Charges (Per Order) (Optional)"] || 0
          ),
          transactionFee: parseFloat(
            row["Transaction Fee (Per Order) (Optional)"] || 0
          ),
          totalDiscount: parseFloat(
            row["Total Discount (Per Order) (Optional)"] || 0
          ),
          orderTag: row["Order Tag (Optional)"],
          containDocuments: row["*Contain Documents (Yes/No)"] === "Yes",
          resellerName: row["Reseller Name (Optional)"],
        },
        packageDetails: {
          weight: parseFloat(row["*Weight Of Shipment (kg)"] || 0),
          length: parseFloat(row["*Length (cm)"]) || 0,
          breadth: parseFloat(row["*Breadth (cm)"] || 0),
          height: parseFloat(row["*Height (cm)"] || 0),
        },
        courierId: row["Courier ID (Optional)"],
        sendNotification:
          row["Send Notification (Yes/No) (Optional)"] === "Yes",
        pickupAddressId: row["Pickup Address Id (Optional)"],
        status: "Pending",
      });
      validCount++;
    }

    console.log("orderDocs:",orderDocs);
    console.log("validate orders for Excel file:",validCount);
    console.log("Rejected orders for Excel file:",rejectedCount);
       
    
    // Insert all orders in bulk
    if(orderDocs.length > 0){
      await bulkOrdersExcel.insertMany(orderDocs);
    }

    // Update file metadata
    fileData.status = "Completed";
    fileData.noOfOrders = orderDocs.length;
    fileData.successfullyUploaded = orderDocs.length; // Assuming all are successful initially
    await fileData.save();

    return res.status(200).json({
      message: "File uploaded and orders processed successfully",
      validOrders: validCount,
      rejectedOrders: rejectedCount,
      file: fileData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the file" });
  }
};

module.exports = {
  bulkOrder,
};
