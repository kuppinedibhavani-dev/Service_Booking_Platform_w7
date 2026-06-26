const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      bookingDate,
      timeSlot,
      customerName,
      customerEmail,
      customerPhone
    } = req.body;

    if (
      !serviceId ||
      !bookingDate ||
      !timeSlot ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return res.status(400).json({
        message: "All booking details are required"
      });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    // Check if slot already booked
    const existingBooking = await Booking.findOne({
      serviceId,
      bookingDate,
      timeSlot,
      status: { $ne: "Cancelled" }
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This slot is already booked"
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      providerId: service.providerId,
      bookingDate,
      timeSlot,
      totalAmount: service.price,
      customerName,
      customerEmail,
      customerPhone,
      paymentStatus: "Pending"
    });

    // App notification
    await Notification.create({
      userId: req.user._id,
      message: `Booking placed for ${service.serviceName}`,
      type: "Booking"
    });

    // Email notification
    await sendEmail(
      customerEmail,
      "Booking Confirmation",
      `Your booking for ${service.serviceName} has been placed successfully.`
    );

    booking.emailSent = true;

    // SMS notification
    await sendSMS(
      customerPhone,
      `Your booking for ${service.serviceName} has been placed successfully.`
    );

    booking.smsSent = true;

    await booking.save();

    res.status(201).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET USER BOOKINGS
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id
    })
      .populate("serviceId")
      .populate("providerId", "name email");

    res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE BOOKING STATUS
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID"
      });
    }

    const booking = await Booking.findById(id)
      .populate("serviceId")
      .populate("userId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    // App notification
    await Notification.create({
      userId: booking.userId._id,
      message: `Booking status updated to ${booking.status}`,
      type: "Booking"
    });

    // Email notification
    await sendEmail(
      booking.customerEmail,
      "Booking Status Updated",
      `Your booking for ${booking.serviceId.serviceName} is now ${booking.status}.`
    );

    booking.emailSent = true;

    // SMS notification
    await sendSMS(
      booking.customerPhone,
      `Your booking status for ${booking.serviceId.serviceName} is now ${booking.status}.`
    );

    booking.smsSent = true;

    await booking.save();

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CANCEL BOOKING
const deleteBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("serviceId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = "Cancelled";
    booking.cancellationReason =
      cancellationReason || "No reason provided";

    await booking.save();

    // Email notification
    await sendEmail(
      booking.customerEmail,
      "Booking Cancelled",
      `Your booking for ${booking.serviceId.serviceName} has been cancelled.`
    );

    booking.emailSent = true;

    // SMS notification
    await sendSMS(
      booking.customerPhone,
      `Your booking for ${booking.serviceId.serviceName} has been cancelled.`
    );

    booking.smsSent = true;

    await booking.save();

    // App notification
    await Notification.create({
      userId: booking.userId,
      message: `Booking cancelled for ${booking.serviceId.serviceName}`,
      type: "Booking"
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBooking,
  deleteBooking
};