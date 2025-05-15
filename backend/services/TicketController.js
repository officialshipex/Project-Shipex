const Ticket = require('../models/TicketSchema');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Generate unique 10-digit ticket number
const generateTicketNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Create a new ticket
const createTicket = async (req, res) => {
  let { category, subcategory, awbType, awbNumbers, fullname, phoneNumber, userId, email, isAdmin, company, status, message } = req.body;

  if (!category || !subcategory || !awbType || !awbNumbers || !fullname || !phoneNumber || !userId || !email || !company || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const ticketNumber = generateTicketNumber();

    // Ensure AWB numbers are stored correctly
    if (typeof awbNumbers === "string") {
      awbNumbers = awbNumbers.split(",").map(awb => awb.trim()).filter(awb => awb.length > 0);
    }

    // Validate status
    const validStatuses = ["active", "resolved", "deleted"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const newTicket = new Ticket({
      category,
      subcategory,
      awbType,
      awbNumbers,
      ticketNumber,
      fullname,
      phoneNumber,
      userId,
      email,
      isAdmin,
      company,
      message,
      status: status || "active" // Default to "active" if not provided
    });

    await newTicket.save();

    res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tickets for a specific user
const getUserTickets = async (req, res) => {
  try {
    const userId = req.user?._id || req.employee?._id;
if (!userId) {
  return res.status(401).json({ message: "Unauthorized: User not found" });
}
const tickets = await Ticket.find({ userId });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["active", "resolved", "deleted"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Status updated successfully", ticket: updatedTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  upload,
  createTicket,
  getAllTickets,
  getTicketById,
  getUserTickets,
  updateTicketStatus,
  deleteTicket
};
