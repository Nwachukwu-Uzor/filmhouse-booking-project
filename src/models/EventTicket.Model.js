import mongoose from "mongoose";
const { model, Schema } = mongoose;

import { generateIdentificationCode } from "../utils/generateIdentificationCode.js";

const eventTicketSchema = new Schema({
  eventTicketNumber: {
    type: String,
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
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

eventTicketSchema.pre("save", async function (next) {
  const eventTicket = this;

  let eventTicketNumber = generateIdentificationCode(20, "FHET");

  while (
    await eventTicket.constructor.findOne({
      eventTicketNumber,
    })
  ) {
    code = generateIdentificationCode(20, "FHB");
  }

  eventTicket.eventTicketNumber = eventTicketNumber;
  next();
});

export const EventTicketModel = model("EventTicket", eventTicketSchema);
