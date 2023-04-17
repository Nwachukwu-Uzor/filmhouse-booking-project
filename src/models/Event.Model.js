import mongoose from "mongoose";
const { model, Schema } = mongoose;

import { generateIdentificationCode } from "../utils/generateIdentificationCode.js";

const eventSchema = new Schema({
  code: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  banner: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  galleryImages: {
    required: true,
    type: [Schema.Types.ObjectId],
    ref: "Image",
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

  let code = generateIdentificationCode(20, "FHE");

  while (
    await event.constructor.findOne({
      code,
    })
  ) {
    code = generateIdentificationCode(20, "FHE");
  }

  event.code = code;
  next();
});

export const EventModel = model("Event", eventSchema);
