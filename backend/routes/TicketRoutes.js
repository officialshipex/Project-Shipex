const express = require("express");
const router = express.Router();
const {
  upload,
  createTicket,
  getAllTickets,
  getTicketById,
  deleteTicket,
  getUserTickets,
} = require("../services/TicketController");
const {isAuthorized} = require("../middleware/auth.middleware.js");

// Create ticket with file upload support
router.post("/", upload.single("file"), createTicket);

// Fetch all tickets (Admin only)
router.get("/", getAllTickets);

// Fetch logged-in user's tickets (Now protected with authMiddleware)
router.get("/user", isAuthorized, getUserTickets);

// Fetch a ticket by ID
router.get("/:id", getTicketById);

// Delete a ticket by ID
router.delete("/:id", deleteTicket);

module.exports = router;
