const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayment,
  verifyPayment
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createPayment);
router.post("/verify", protect, verifyPayment);
router.get("/:id", protect, getPayment);

module.exports = router;