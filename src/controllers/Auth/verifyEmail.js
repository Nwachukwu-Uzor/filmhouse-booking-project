import { UserModel, TokenModel } from "../../models/index.js";

export const verifyEmail = async (req, res) => {
  const { token, user_id } = req.query;

  try {
    const tokenExists = await TokenModel.findOne({
      $and: [{ token: token }, { user: user_id }],
    });
    if (!tokenExists) {
      return res.status(404).json({
        message: "Invalid token",
        hasExpired: false,
        tokenValid: true,
      });
    }

    const user = await UserModel.findById(user_id);

    if (!user) {
      return res.status(404).json({
        message: "Invalid token",
        hasExpired: false,
        tokenValid: false,
      });
    }

    const hasTokenExpired =
      new Date().getTime() > tokenExists.expiresAt.getTime();

    if (hasTokenExpired) {
      return res.status(400).json({
        message: "Token has expired, please request for an new one.",
        hasExpired: true,
        tokenValid: true,
      });
    }

    user.emailConfirmed = true;

    await user.save();

    return res.status(200).json({
      message: `Your email ${user._doc.email} has been successfully confirmed`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "An Error has occurred" });
  }
};
