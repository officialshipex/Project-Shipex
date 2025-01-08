const router = require('express').Router();
const { setting, newLable } = require('./label.controller');

router.post("/new", newLable);
router.put("/setting", setting);

module.exports = router;