import mongoose from "mongoose";
const { model, Schema } = mongoose;

const BookingSchema = new Schema({
  bookingNumber: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
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

export const BookingModel = model("Booking", BookingSchema);
