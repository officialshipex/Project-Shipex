const router = require('express').Router();
const { setting, newLable,labelData } = require('./label.controller');

router.post("/new", newLable);
router.put("/setting", setting);
router.get('/all',labelData)

module.exports = router;