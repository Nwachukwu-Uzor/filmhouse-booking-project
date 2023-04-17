import mongoose from "mongoose";
const { model, Schema } = mongoose;

import { generateIdentificationCode } from "../utils/generateIdentificationCode.js";

const bookingSchema = new Schema({
  bookingNumber: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: "Ticket",
  },
  price: {
    type: Number,
    required: true,
  },
  userEmail: {
    type: String,
    required: [
      function () {
        return (
          this.user === null ||
          this.user.trim().length === 0 ||
          !mongoose.isValidObjectId(this.user)
        );
      },
    ],
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: ["Used", "Canceled", "Unused"],
    default: "Unused",
  },
});

bookingSchema.pre("save", async function (next) {
  const booking = this;

  let bookingNumber = generateIdentificationCode(20, "FHB");

  while (
    await booking.constructor.findOne({
      bookingNumber,
    })
  ) {
    code = generateIdentificationCode(20, "FHB");
  }

  booking.bookingNumber = bookingNumber;
  next();
});

export const BookingModel = model("Booking", bookingSchema);
