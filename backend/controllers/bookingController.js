const Booking = require("../models/Booking");
const Service = require("../models/Service");
const mongoose = require("mongoose");

// Create Booking
const Notification = require("../models/Notification");

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, timeSlot } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

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

    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      providerId: service.providerId,
      bookingDate,
      timeSlot,
      totalAmount: service.price
    });

    // Auto Notification
    await Notification.create({
      userId: req.user._id,
      message: `Your booking for ${service.serviceName} has been placed successfully.`,
      type: "Booking"
    });

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

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = req.body.status || booking.status;

    const updatedBooking = await booking.save();

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

    // Auto Notification
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