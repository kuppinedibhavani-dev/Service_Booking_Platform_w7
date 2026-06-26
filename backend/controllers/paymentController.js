const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE PAYMENT ORDER
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

    if (booking.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "Payment already completed"
      });
    }

    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${booking._id}`
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    await Payment.create({
      bookingId,
      userId: booking.userId._id,
      amount: booking.totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      transactionId: order.id
    });

    res.status(200).json({
      success: true,
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

// VERIFY PAYMENT
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
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
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
        paymentStatus: "Success",
        paymentId: razorpay_payment_id
      },
      { new: true }
    ).populate("userId");

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: "Confirmed",
        paymentStatus: "Paid",
        paymentId: razorpay_payment_id,
        transactionId: razorpay_order_id
      },
      { new: true }
    ).populate("serviceId");

    // App notification
    await Notification.create({
      userId: payment.userId._id,
      message: `Payment successful for ${booking.serviceId.serviceName}. Booking confirmed.`,
      type: "Payment"
    });

    // Email notification
    await sendEmail(
      payment.userId.email,
      "Payment Successful",
      `Your payment for ${booking.serviceId.serviceName} was successful and your booking has been confirmed.`
    );

    booking.emailSent = true;

    // SMS notification
    await sendSMS(
      booking.customerPhone,
      `Payment successful for ${booking.serviceId.serviceName}. Your booking is confirmed.`
    );

    booking.smsSent = true;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE PAYMENT
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("bookingId")
      .populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    res.status(200).json({
      success: true,
      payment
    });

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