const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

router.get(
  "/bookings",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);

router.put(
  "/bookings/:id",
  authMiddleware,
  adminMiddleware,
  updateBookingStatus
);

module.exports = router;