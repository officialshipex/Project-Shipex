const router = require('express').Router();
const auth = require('../controllers/auth.controller');


router.use('/auth', auth);

module.exports = router;