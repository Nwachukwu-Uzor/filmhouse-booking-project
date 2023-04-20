import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ticketSchema = new Schema({
  type: {
    ref: "TicketType",
    type: Schema.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  event: {
    ref: "Event",
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const TicketModel = model("Ticket", ticketSchema);
