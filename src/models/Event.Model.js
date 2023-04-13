import mongoose from "mongoose";
const { model, Schema } = mongoose;

import { generateIdentificationCode } from "../utils/generateIdentificationCode.js";

const eventSchema = new Schema({
  eventCode: {
    type: String,
    // required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  approvalStatus: {
    type: String,
    enum: ["Approved", "Declined", "Pending"],
    default: "Pending",
  },
});

eventSchema.pre("save", async function (next) {
  const event = this;

  let eventCode = generateIdentificationCode(20, "FHE");

  while (
    await event.constructor.findOne({
      eventCode,
    })
  ) {
    eventCode = generateIdentificationCode(20, "FHE");
  }

  event.eventCode = eventCode;
  next();
});

export const EventModel = model("Event", eventSchema);
