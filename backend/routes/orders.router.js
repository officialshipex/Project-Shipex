const multer = require('multer');
const path = require('path');
const orderRouter = require('express').Router();
const {createOrder,getAllOrders} = require('../Orders/order.controller');
const {bulkOrder} = require('../Orders/bulkOrders.controller');
const {createQuickOrder} = require('../Orders/quickOrder.controller');

// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // unique filename
    }
  });

const upload = multer({ storage:storage });

orderRouter.post('/create-order',createOrder);
orderRouter.get('/get-all-orders',getAllOrders);
orderRouter.post('/upload-bulk-orders',upload.single('bulkOrderFile'),bulkOrder);
orderRouter.post('/quick-order',createQuickOrder);

module.exports = orderRouter;