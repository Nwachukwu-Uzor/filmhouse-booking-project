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
  createdAt: { type: Date, default: Date.now, expires: "2h" },
});

export const TokenModel = model("Token", tokenSchema);
