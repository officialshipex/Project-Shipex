// controllers/roleController.js
const Role = require('../models/roles.modal')
const bcrypt = require("bcryptjs");

exports.createRole = async (req, res) => {
    try {
        const {
            fullName,
            email,
            contactNumber,
            password,
            isActive,
            role,
            accessRights,
        } = req.body;

        // Check if a user already exists with this email
        const existingUser = await Role.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email ID already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Role with actual access rights objects
        const newRole = new Role({
            fullName,
            email,
            contactNumber,
            password: hashedPassword,
            isActive,
            role,
            accessRights: {
                billing: accessRights.billing || {}, // Default to empty object if not provided
                tools: accessRights.tools || {},
                wallet: accessRights.wallet || {},
                accounts: accessRights.accounts || {},
                settings: accessRights.settings || {},
                courier: accessRights.courier || {},
                orders: accessRights.orders || {},
            },
        });

        await newRole.save();

        return res.status(201).json({
            message: "Role created successfully",
            role: newRole,
        });

    } catch (error) {
        console.error("Create Role Error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};





exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedRole = await Role.findByIdAndUpdate(id, updates, { new: true });
    return res.status(200).json({ message: "Role updated", updatedRole });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
