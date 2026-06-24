const sendEmail = require("../utils/sendEmail");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Create Booking
const createBooking = async (req, res) => {
  try {
      console.log("createBooking controller hit");
    const { serviceId, bookingDate, timeSlot } = req.body;

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
      totalAmount: service.price
    });

    // App Notification
    await Notification.create({
      userId: req.user._id,
      message: `Your booking for ${service.serviceName} has been placed successfully.`,
      type: "Booking"
    });

    console.log("Booking created successfully");
console.log("User email:", req.user.email);
console.log("Calling sendEmail...");

    // Email Notification
    await sendEmail(
      req.user.email,
      "Booking Confirmation",
      `Your booking for ${service.serviceName} has been placed successfully.`
    );

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get My Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id
    })
      .populate("serviceId")
      .populate("providerId", "name email");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update Booking Status
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Booking ID"
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

    booking.status = req.body.status || booking.status;

    const updatedBooking = await booking.save();

    // App Notification
    await Notification.create({
      userId: booking.userId._id,
      message: `Your booking for ${booking.serviceId.serviceName} status updated to ${booking.status}.`,
      type: "Booking"
    });

    console.log("Updating booking status...");
console.log("User email:", booking.userId.email);
console.log("Calling status update email...");

    // Email Notification
    await sendEmail(
      booking.userId.email,
      "Booking Status Updated",
      `Your booking for ${booking.serviceId.serviceName} is now ${booking.status}.`
    );

    res.status(200).json(updatedBooking);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Cancel Booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    console.log("Cancelling booking...");
console.log("User email:", req.user.email);
console.log("Calling cancel email...");

    // Email Notification
    await sendEmail(
      req.user.email,
      "Booking Cancelled",
      `Your booking for ${booking.serviceId.serviceName} has been cancelled successfully.`
    );

    // App Notification
    await Notification.create({
      userId: req.user._id,
      message: `Your booking for ${booking.serviceId.serviceName} has been cancelled.`,
      type: "Booking"
    });

    res.status(200).json({
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