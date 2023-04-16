import mongoose from "mongoose";

import { generateToken } from "../utils/generateToken.js";

const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  token: {
    type: String,
    default: generateToken(32),
  },
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  },
});

export const TokenModel = model("Token", tokenSchema);
