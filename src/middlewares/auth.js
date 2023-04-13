import jwt from "jsonwebtoken";
import { tokenSecret, tokenIssuer } from "../../config/index.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Sign in and try again" });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verifiedToken = jwt.verify(token, tokenSecret);

    console.log(verifiedToken);

    if (!verifiedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
