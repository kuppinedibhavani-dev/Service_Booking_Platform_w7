const Booking = require("../models/Booking");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

// Create Booking
const createBooking = async (req, res) => {
  const { service, date, time, address } = req.body;

  try {
    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      service,
      date,
      time,
      address
    });

    // Get user details
    const user = await User.findById(req.user.id);

    // Send Email
    try {
      await sendEmail(
        user.email,
        "Booking Confirmation",
        `Your booking has been confirmed for ${date} at ${time}.`
      );
    } catch (emailError) {
      console.log("Email error:", emailError.message);
    }

    // Send SMS
    try {
      await sendSMS(
        "+919390402526",
        `Your booking is confirmed for ${date} at ${time}`
      );
    } catch (smsError) {
      console.log("SMS error:", smsError.message);
    }

    res.status(201).json(booking);

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

// Get Logged-in User Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id
    }).populate("service");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get All Bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("service");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update Booking Status
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.status = status;

    await booking.save();

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus
};