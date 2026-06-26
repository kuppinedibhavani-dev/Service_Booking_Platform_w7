const express = require("express");
const router = express.Router();

const {
  getAllBookings
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");

// Admin bookings route
router.get("/bookings", protect, getAllBookings);

module.exports = router;