const fs = require('fs');
const csvParser = require('csv-parser');
const Order = require('../models/bulkOrder.model');

const requiredHeaders = [
    'orderId', 'paymentType', 'shippingCustomerFirstName', 'shippingCustomerLastName',
    'shippingAddress', 'landmark', 'customerPhoneNumber', 'city', 'state', 'pincode',
    'weightInGrams', 'length', 'height', 'breadth',
    'shippingCharges', 'codCharges', 'taxAmount', 'discount', 'sku',
    'productDetails', 'quantity', 'price'
];

const bulkOrderUpload = async (req, res) => {
    const filePath = req.file.path;

    const orders = [];

    try {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('headers', (headers) => {
                const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
                if (missingHeaders.length > 0) {
                    return res.status(400).json({ error: `Missing headers: ${missingHeaders.join(', ')}` });
                }
            })
            .on('data', (row) => {
                // Map dimensions into a nested object
                const { length, height, breadth, ...rest } = row;
                orders.push({
                    ...rest,
                    dimensions: {
                        length: parseFloat(length),
                        height: parseFloat(height),
                        breadth: parseFloat(breadth),
                    },
                    weightInGrams: parseFloat(row.weightInGrams),
                    shippingCharges: parseFloat(row.shippingCharges),
                    codCharges: parseFloat(row.codCharges),
                    taxAmount: parseFloat(row.taxAmount),
                    discount: parseFloat(row.discount),
                    quantity: parseInt(row.quantity),
                    price: parseFloat(row.price),
                });
            })
            .on('end', async () => {
                try {
                    await Order.insertMany(orders);
                    res.status(200).json({ message: 'Orders uploaded successfully!' });
                } catch (err) {
                    res.status(500).json({ error: 'Failed to insert orders into the database', details: err.message });
                } finally {
                    fs.unlinkSync(filePath); // Delete the uploaded file
                }
            });
    } catch (err) {
        res.status(500).json({ error: 'Error processing the file', details: err.message });
    }
};

module.exports = { bulkOrderUpload };
