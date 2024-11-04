const multer = require('multer');
const path = require('path');
const orderRouter = require('express').Router();
const {createOrder,getAllOrders} = require('../Orders/order.controller');
const {bulkOrders} = require('../Orders/bulkOrders.controller');

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

orderRouter.post('/createorder',createOrder);
orderRouter.get('/getallorders',getAllOrders);
orderRouter.post('/upload-bulk-orders',upload.single('bulkOrderFile'),bulkOrders);

module.exports = orderRouter;