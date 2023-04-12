import { UserModel, TokenModel } from "../models/index.js";

import { environment, location, clientUrl } from "../../config/index.js";
import { developmentLogger, productionLogger } from "../utils/logger.js";
import { sendMail } from "../services/index.js";

export const createAccount = async (req, res) => {
  const { email, password, username, address } = req.body;

  const logMessage = `headers: ${JSON.stringify(
    req.headers
  )} body: ${JSON.stringify(req.body)}`;

  if (environment === "Development") {
    developmentLogger.log("info", logMessage);
  } else {
    productionLogger.log("info", logMessage);
  }

  try {
    const promises = [];
    const emailExistsPromise = UserModel.findOne({ email: email });
    promises.push(emailExistsPromise);

    // check if the username is supplied and adds it to the array of promises
    if (username) {
      const usernameExistsPromise = UserModel.findOne({ username: username });
      promises.push(usernameExistsPromise);
    }

    const [emailExists, usernameExists] = await Promise.all(promises);

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await UserModel.create({ email, password, username });

    //  sendMail(
    //     email,
    //     `<div><h2>Account Created Successfully</h2></div>`,
    //     "Account Created"
    //   );

    const confirmationToken = await TokenModel.create({
      user: newUser._id,
    });

    const confirmUrl = `${clientUrl}/confirm-account?token=${confirmationToken._doc.token}&&user_id=${newUser._id}`;

    const emailParameters = {
      email,
      body: `<div>
        <h3>Dear ${username}</h3>
        <p>You account has been created successfull, please click the link below to confirm your accout</p>
        <a href=${confirmUrl}>Confirm</a>
      </div>`,

      subject: "Account Created Successfully",
    };

    await sendMail(
      emailParameters.email,
      emailParameters.body,
      emailParameters.subject
    );

    res.setHeader("Location", `${location}/account/${newUser._id}`);
    return res.status(201).json({
      message:
        "Successfully registered, check your email for confirmation link.",
    });
  } catch (error) {
    if (environment === "Development") {
      developmentLogger.log("error", JSON.stringify(error));
    } else {
      productionLogger.log("error", JSON.stringify(error));
    }

    return res
      .status(400)
      .json({ message: `Registeration failed: ${error?.message ?? ""}` });
  }
};
