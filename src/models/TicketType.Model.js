import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EXISTING_TICKET_TYPES = ["Regular", "VIP", "Classic"];

const ticketTypeSchema = new Schema({
  typeName: {
    type: String,
    required: true,
    enum: EXISTING_TICKET_TYPES,
    default: "Regular",
  },
  createdAt: { type: Date, default: Date.now },
});

export const TicketTypeModel = model("TicketType", ticketTypeSchema);
