const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");

// Create new booking
router.post("/", protect, createBooking);

// Get logged-in user bookings
router.get("/mybookings", protect, getMyBookings);

// Update booking status (Admin/Provider)
router.put("/:id", protect, updateBooking);

// Cancel booking
router.put("/cancel/:id", protect, deleteBooking);

module.exports = router;