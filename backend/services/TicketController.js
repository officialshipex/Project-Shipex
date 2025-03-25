const Ticket = require('../models/TicketSchema');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');

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
  let { category, subcategory, awbType, awbNumbers, fullname, phoneNumber, userId, email, isAdmin, company } = req.body;

  if (!category || !subcategory || !awbType || !awbNumbers || !fullname || !phoneNumber || !userId || !email || !company) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const ticketNumber = generateTicketNumber();

    // Ensure AWB numbers are stored correctly
    if (typeof awbNumbers === "string") {
      awbNumbers = awbNumbers.split(",").map(awb => awb.trim()).filter(awb => awb.length > 0);
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
    });

    await newTicket.save();

    res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
  
  
  

const getAllTickets = async (req, res) => {
  try {

    const tickets = await Ticket.find();
    // console.log(tickets)
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const mongoose = require('mongoose');

const getUserTickets = async (req, res) => {
  try {
    console.log("req.user:", req.user);

    if (!req.user || !req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const userId = req.user.userId; // Extract number
    // console.log("Extracted userId:", userId);

    const tickets = await Ticket.find({ userId }); // Query using number
    // console.log("Tickets found:", tickets);

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
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  upload,
  createTicket,
  getAllTickets,
  getTicketById,
  getUserTickets,
  deleteTicket
};
