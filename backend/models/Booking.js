const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  bookingDate: Date,
  timeSlot: String,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending"
  },
  totalAmount: Number
});

module.exports = mongoose.model("Booking", bookingSchema);