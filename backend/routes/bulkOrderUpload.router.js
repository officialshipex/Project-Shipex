const express = require('express');
const multer = require('multer');
const { bulkOrderUpload } = require('../Orders/bulkOrdersUpload.controller');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), bulkOrderUpload);

module.exports = router;
