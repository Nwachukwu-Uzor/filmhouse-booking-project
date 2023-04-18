import { UserModel } from "../../models/index.js";

import { developmentLogger, productionLogger } from "../../utils/logger.js";
import {
  environment,
  tokenIssuer,
  tokenSecret,
} from "../../../config/index.js";

import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isUserAnAdmin =
      user?.roles?.includes("superAdmin") || user?.roles?.includes("admin");

    if (!isUserAnAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        email: user._doc.email,
        phone: user._doc.phone,
      },
      tokenSecret,
      { issuer: tokenIssuer, expiresIn: "2h" }
    );

    return res.status(200).json({ token, message: "Login Successful" });
  } catch (error) {
    if (environment === "Development") {
      developmentLogger.log("error", JSON.stringify(error));
    } else {
      productionLogger.log("error", JSON.stringify(error));
    }

    return res.status(500).json({ message: error.message });
  }
};
