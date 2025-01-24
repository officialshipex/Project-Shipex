const router = require('express').Router();
<<<<<<< HEAD
const { setting, newLable } = require('./label.controller');

router.post("/new", newLable);
router.put("/setting", setting);
=======
const { setting, newLable,labelData } = require('./label.controller');

router.post("/new", newLable);
router.put("/setting", setting);
router.get('/all',labelData)
>>>>>>> 2f5fb255d19459b4d181857acf2a4bda5760fa09

module.exports = router;