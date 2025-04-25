// controllers/roleController.js
const Role = require('../models/roles.modal')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const createRole = async (req, res) => {
  try {
    const {
      fullName,
      email,
      contactNumber,
      password,
      isActive,
      role,
      accessRights,
      isAdmin = true, // Default to true if not provided
      adminTab = true, // Default to true if not provided
    } = req.body;

    const existingUser = await Role.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRole = new Role({
      fullName,
      email,
      contactNumber,
      password: hashedPassword,
      isActive,
      isAdmin, // Explicitly set isAdmin
      adminTab, // Explicitly set adminTab
      role,
      accessRights,
    });

    await newRole.save();

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        user: {
          id: newRole._id,
          email: newRole.email,
          fullName: newRole.fullName,
          role: newRole.role,
          isAdmin: newRole.isAdmin,
          adminTab: newRole.adminTab,
        },
      },
    });
  } catch (error) {
    console.error("Create Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};






const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateRole = async (req, res) => {
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

  const deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const employee = await Role.findOne({ email });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee does not exist",
      });
    }

    const checkPassword = await bcrypt.compare(password, employee.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        employee: {
          id: employee._id,
          email: employee.email,
          fullName: employee.fullName,
          isAdmin: employee.isAdmin,
          adminTab: employee.adminTab,
          isEmployee: true
        }
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    

    return res.status(200).json({
      success: true,
      message: "Employee logged in successfully",
      data: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { login, createRole, getAllRoles, getRoleById, updateRole, deleteRole };