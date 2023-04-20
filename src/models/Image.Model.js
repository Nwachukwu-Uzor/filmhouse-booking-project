import mongoose from "mongoose";

import { generateToken } from "../utils/generateToken.js";

const { Schema, model } = mongoose;

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    default: "",
  },
  uploadedAt: { type: Date, default: Date.now },
});

export const ImageModel = model("Image", imageSchema);
