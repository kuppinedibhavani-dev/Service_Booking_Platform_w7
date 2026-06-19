const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: Number,
  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Payment", paymentSchema);