import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingNumber: String,
  userName: String,
});

export const BookingModel = mongoose.model("bookings", BookingSchema);
