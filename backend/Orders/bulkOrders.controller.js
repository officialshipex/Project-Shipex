const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const File = require('../model/bulkOrderFiles.model.js');
const bulkOrder = require('../model/bulkOrders.model');
const path = require('path');

// Helper function to read CSV file
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const orders = [];
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      orders.push(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      resolve(orders);
    })
    .on('error', (error) => {
      console.log("CSV Parsing error:",error);
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
// Bulk Order Upload Endpoint
const bulkOrders = async (req,res) => {
  try {
    if (!req.file) {
              return res.status(400).json({ error: 'No file uploaded' });
          }

          // Save file metadata
          const fileData = new File({
              filename: req.file.filename,
              date: new Date(),
              status: 'Processing',
          });
          await fileData.save();

          // Determine the file extension
          const fileExtension = path.extname(req.file.path).toLowerCase();
          console.log("fileextenction:",fileExtension);
          let orders = [];

          // Parse the file based on its extension
          if (fileExtension === '.csv') {
              console.log('12345')
              orders = await parseCSV(req.file.path);
          } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
              orders = parseExcel(req.file.path);
          } else {
              return res.status(400).json({ error: 'Unsupported file format' });
          }

          console.log("orders:",orders);
          console.log("asss");
          
          // Map parsed data to Order model format
          const orderDocs = orders.map((row) => {
              const items = [{
                  productId: row.productId,
                  quantity: parseInt(row.quantity),
                  price: parseFloat(row.price)
              }];
              const orderTotal = items.reduce((total, item) => total + (item.quantity * item.price), 0);
              console.log(row.orderId);
              console.log(row.customerName);
              
              
              return {
                  fileId: fileData._id,
                  orderId: row.orderId,
                  customerName: row.customerName,
                  customerAddress: row.customerAddress,
                  customerEmail: row.customerEmail,
                  items: items,
                  orderTotal: orderTotal,
                  status: 'Pending'
              };
          });

          // Insert all orders in bulk
          await bulkOrder.insertMany(orderDocs);

          // Update file metadata
          fileData.status = 'Completed';
          fileData.noOfOrders = orderDocs.length;
          fileData.successfullyUploaded = orderDocs.length; // Assuming all are successful initially
          await fileData.save();
          console.log(fileData);
          
          return res.status(200).json({
              message: 'File uploaded and orders processed successfully',
              file: fileData
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while processing the file' });
      }
};

    // try {
    //   // Check if file is provided
    //   if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
    //   // Read uploaded Excel file
    //   const workbook = XLSX.readFile(req.file.path);
    //   const sheetName = workbook.SheetNames[0];
    //   const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
    //   const orders = [];
    //   const errors = [];
  
    //   // Validate and process each order
    //   sheetData.forEach((row, index) => {
    //     const { orderId, customerName, product, quantity } = row;
  
    //     if (!orderId || !customerName || !product || !quantity) {
    //       errors.push({ row: index + 2, error: 'Missing required fields' });
    //     } else {
    //       orders.push({
    //         orderId,
    //         customerName,
    //         product,
    //         quantity: parseInt(quantity, 10),
    //         status: 'Pending'
    //       });
    //     }
    //   });
  
    //   // Insert valid orders into MongoDB
    //   const savedOrders = await Order.insertMany(orders);
  
    //   res.json({
    //     message: 'Orders uploaded successfully',
    //     successfulUploads: savedOrders.length,
    //     errors
    //   });
    // } catch (err) {
    //   console.error("Error processing file:", err);
    //   res.status(500).json({ error: 'Internal server error' });
    // }
  // };
    
module.exports = {
  bulkOrders
}