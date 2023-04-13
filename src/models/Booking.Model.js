import mongoose from "mongoose";
const { model, Schema } = mongoose;

const BookingSchema = new Schema({
  bookingNumber: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Failed"],
    default: "Pending",
  },
});

export const BookingModel = model("Booking", BookingSchema);
