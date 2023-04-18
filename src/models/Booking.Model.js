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
    required: [
      function () {
        return (
          this?.userEmail === null || this?.userEmail?.trim()?.length === 0
        );
      },
    ],
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
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
          this?.user === null ||
          this?.user?.trim()?.length === 0 ||
          !mongoose.isValidObjectId(this.user)
        );
      },
    ],
    validate: {
      validator: function (v) {
        // custom regex validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
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
