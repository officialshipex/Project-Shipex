// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const roleController = require("../staffRoles/rolesController");

router.post("/createRole", roleController.createRole);
router.get("/", roleController.getAllRoles);
router.get("/:id", roleController.getRoleById);
router.put("/updateRole/:id", roleController.updateRole);
router.delete("/deleteRole/:id", roleController.deleteRole);

module.exports = router;
