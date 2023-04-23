import jwt from "jsonwebtoken";
import { tokenSecret } from "../../config/index.js";

import { UserModel } from "../models/index.js";

export const validateUserToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const verifiedToken = jwt.verify(token, tokenSecret);

    console.log(verifiedToken);

    if (!verifiedToken) {
      req.user = null;
      return next();
    }

    const user = await UserModel.findById(verifiedToken?.userId);

    req.user = user._doc;

    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
