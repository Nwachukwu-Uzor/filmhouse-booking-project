const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bookingNumber: String,
  userName: String,
});

const BookingModel = mongoose.model("bookings", BookingSchema);

module.exports = {
  BookingModel,
};
