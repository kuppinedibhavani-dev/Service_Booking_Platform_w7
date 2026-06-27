const Booking = require("../models/Booking");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { service, date, time, amount } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      service,
      date,
      time,
      amount
    });

    const user = await User.findById(req.user.id);

    await sendEmail(
      user.email,
      "Booking Created",
      "Your booking has been created successfully."
    );

    if (user.phone) {
      await sendSMS(user.phone, "Your booking is confirmed.");
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get my bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id
    }).populate("service");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("service");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update booking status (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};