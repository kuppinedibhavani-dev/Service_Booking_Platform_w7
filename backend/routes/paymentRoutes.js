const express = require("express");
const router = express.Router();

const {
  createPayment,
  verifyPayment,
  getPayment
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

// Create Razorpay order
router.post("/create", protect, createPayment);

// Verify payment after success
router.post("/verify", protect, verifyPayment);

// Get payment details
router.get("/:id", protect, getPayment);

module.exports = router;