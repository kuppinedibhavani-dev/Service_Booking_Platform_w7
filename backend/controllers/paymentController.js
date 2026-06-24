const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Payment Order
const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("serviceId")
      .populate("userId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${booking._id}`
    };

    const order = await razorpay.orders.create(options);

    // Create payment record (Pending)
    await Payment.create({
      bookingId,
      userId: booking.userId._id,
      amount: booking.totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending"
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed"
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { bookingId },
      {
        paymentStatus: "Success"
      },
      { new: true }
    ).populate("userId");

    // Confirm booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: "Confirmed"
      },
      { new: true }
    ).populate("serviceId");

    // App Notification
    await Notification.create({
      userId: payment.userId._id,
      message: `Payment successful for ${booking.serviceId.serviceName}. Booking confirmed.`,
      type: "Payment"
    });

    // Email Notification
    await sendEmail(
      payment.userId.email,
      "Payment Successful",
      `Your payment for ${booking.serviceId.serviceName} was successful and your booking has been confirmed.`
    );

    res.status(200).json({
      message: "Payment verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Single Payment
const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("bookingId")
      .populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    res.status(200).json(payment);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  getPayment
};