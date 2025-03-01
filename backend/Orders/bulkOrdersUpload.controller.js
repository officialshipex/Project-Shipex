const fs = require("fs");
const csvParser = require("csv-parser");
const Order = require("../models/newOrder.model.js");
const ExcelJS = require("exceljs");
const path = require("path");
const xlsx = require("xlsx");
const File = require("../model/bulkOrderFiles.model.js");
const bulkOrdersExcel = require("../model/bulkOrdersExcel.model.js");
const bulkOrdersCSV = require("../model/bulkOrderCSV.model.js");

// const requiredHeaders = [
//     'orderId', 'paymentType', 'shippingCustomerFirstName', 'shippingCustomerLastName',
//     'shippingAddress', 'landmark', 'customerPhoneNumber', 'city', 'state', 'pincode',
//     'weightInGrams', 'length', 'height', 'breadth',
//     'shippingCharges', 'codCharges', 'taxAmount', 'discount', 'sku',
//     'productDetails', 'quantity', 'price'
// ];

// const bulkOrderUpload = async (req, res) => {
//     const filePath = req.file.path;

//     const orders = [];

//     try {
//         fs.createReadStream(filePath)
//             .pipe(csvParser())
//             .on('headers', (headers) => {
//                 const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
//                 if (missingHeaders.length > 0) {
//                     return res.status(400).json({ error: `Missing headers: ${missingHeaders.join(', ')}` });
//                 }
//             })
//             .on('data', (row) => {
//                 // Map dimensions into a nested object
//                 const { length, height, breadth, ...rest } = row;
//                 orders.push({
//                     ...rest,
//                     dimensions: {
//                         length: parseFloat(length),
//                         height: parseFloat(height),
//                         breadth: parseFloat(breadth),
//                     },
//                     weightInGrams: parseFloat(row.weightInGrams),
//                     shippingCharges: parseFloat(row.shippingCharges),
//                     codCharges: parseFloat(row.codCharges),
//                     taxAmount: parseFloat(row.taxAmount),
//                     discount: parseFloat(row.discount),
//                     quantity: parseInt(row.quantity),
//                     price: parseFloat(row.price),
//                 });
//             })
//             .on('end', async () => {
//                 try {
//                     await Order.insertMany(orders);
//                     res.status(200).json({ message: 'Orders uploaded successfully!' });
//                 } catch (err) {
//                     res.status(500).json({ error: 'Failed to insert orders into the database', details: err.message });
//                 } finally {
//                     fs.unlinkSync(filePath); // Delete the uploaded file
//                 }
//             });
//     } catch (err) {
//         res.status(500).json({ error: 'Error processing the file', details: err.message });
//     }
// };

const downloadSampleExcel = async (req, res) => {
  try {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sample Bulk Order");

    // Define headers
    worksheet.columns = [
      { header: "*Reciver contactName", key: "contactName", width: 30 },
      { header: "*Reciver email", key: "email", width: 30 },
      { header: "*Reciver phoneNumber", key: "phoneNumber", width: 30 },
      { header: "*Reciver address", key: "address", width: 40 },
      { header: "*Reciver pinCode", key: "pinCode", width: 30 },
      { header: "*Reciver city", key: "city", width: 25},
      { header: "*Reciver state", key: "state", width: 25},
      { header: "*quantity", key: "quantity", width: 20 },
      { header: "*Productname", key: "name", width: 20 },
      { header: "*sku", key: "sku", width: 15 },
      { header: "*unitPrice", key: "unitPrice", width: 20 },
      { header: "*deadWeight(kg)", key: "deadWeight", width: 20 },
      { header: "*length(cm)", key: "length", width: 20 },
      { header: "*width(cm)", key: "width", width: 20 },
      { header: "*height(cm)", key: "height", width: 20 },
      { header: "*method(COD/Prepaid)", key: "method", width: 25 },
    ];

    // Add a sample row
    // worksheet.addRow({
    //     orderId: "12345",
    //     customerName: "John Doe",
    //     phoneNumber: "9876543210",
    //     shippingAddress: "123 Main St",
    //     city: "New York",
    //     state: "NY",
    //     pincode: "10001",
    //     productName: "Laptop",
    //     quantity: 1,
    //     price: 1000
    // });
    // Center-align all header cells
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { bold: true }; // Optional: Make headers bold
    });
    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=sample.xlsx");

    // Write workbook to response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error generating Excel file", details: error.message });
  }
};

// Helper function to read CSV file and store in database
function parseCSV(filePath, fileData) {
  return new Promise((resolve, reject) => {
    const orders = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        // orders.push(row);
        try {
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
            sendNotification:
              row["Send Notification(True/False)"].toLowerCase() === "true",
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
          await order.save();
          console.log(`Imported order: ${order.orderId}`);
        } catch (error) {
          console.error(`Error importing order: ${row["*Order Id"]}`, error);
        }
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve(orders);
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
  // console.log("req.file--",req.file)
  const userID=req.user._id
  // console.log("userID",userID)

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
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    // console.log("fileextension:", fileExtension);
    let orders = [];

    // Parse the file based on its extension
    if (fileExtension === ".csv") {
      orders = await parseCSV(req.file.path, fileData);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      orders = parseExcel(req.file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }
  
     // **Validation: Check if file contains data**
     if (!orders || orders.length === 0) {
      return res.status(400).json({ error: "The uploaded file is empty or contains invalid data" });
    }
    // Map parsed data to Order model format
    const defaultPickupAddress = {
      contactName: "Default Name",
      email: "default@example.com",
      phoneNumber: "0000000000",
      address: "Default Address",
      pinCode: "000000",
      city: "Default City",
      state: "Default State"
    };
    
    const orderDocs = await Promise.all(orders.map(async (row) => {
      
      const deadWeights = parseFloat(row["*deadWeight(kg)"] || 0); // Keep in kg

const volumetricWeights = (
  (parseFloat(row["*length(cm)"] || 0) *
  parseFloat(row["*width(cm)"] || 0) *
  parseFloat(row["*height(cm)"] || 0)) / 5000 // Keep in kg
);

const applicableWeights = Math.max(deadWeights, volumetricWeights); // Keep in kg
      let orderId;
      let isUnique = false;
    
      while (!isUnique) {
        orderId = Math.floor(100000 + Math.random() * 900000); // Generates a random six-digit number
        const existingOrder = await Order.findOne({ orderId });
        if (!existingOrder) {
          isUnique = true;
        }
      }
    
      return {
        userId: userID,
        orderId: orderId,
        pickupAddress: defaultPickupAddress, // Setting default pickup details
        receiverAddress: {
          contactName: row["*Reciver contactName"] || "Unknown",
          email: row["*Reciver email"] || "unknown@example.com",
          phoneNumber: row["*Reciver phoneNumber"] || "0000000000",
          address: row["*Reciver address"] || "No Address",
          pinCode: row["*Reciver pinCode"] || "000000",
          city: row["*Reciver city"] || "Unknown City",
          state: row["*Reciver state"] || "Unknown State"
        },
        paymentDetails: {
          method: row["*method(COD/Prepaid)"] || "Prepaid",
          amount: parseFloat(row["*unitPrice"] || 0)
        },
        productDetails: [{
          id: 1,
          quantity: parseInt(row["*quantity"] || 1),
          name: row["*Productname"] || "Unknown Product",
          sku: row["*sku"] || "UNKNOWN_SKU",
          unitPrice: parseFloat(row["*unitPrice"] || 0)
        }],
        packageDetails: {
          deadWeight: parseFloat(row["*deadWeight(kg)"] || 0),
          applicableWeight: applicableWeights,
          volumetricWeight: {
            length: parseFloat(row["*length(cm)"] || 0),
            width: parseFloat(row["*width(cm)"] || 0),
            height: parseFloat(row["*height(cm)"] || 0)
          }
        },
        status: "new"
      };
    }));
    console.log("-------->",orderDocs)
    // Insert all orders in bulk
    await Order.insertMany(orderDocs);
   
    // Update file metadata
    fileData.status = "Completed";
    fileData.noOfOrders = orderDocs.length;
    fileData.successfullyUploaded = orderDocs.length; // Assuming all are successful initially
    await fileData.save();

    return res.status(200).json({
      message: "bulk order upload  successfully",
      file: fileData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the file" });
  }
};

module.exports = { bulkOrder, downloadSampleExcel };
