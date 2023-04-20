import { ImageModel, UserModel, TokenModel } from "../../models/index.js";
import { uploadImage } from "../../services/imageService.js";

import { developmentLogger, productionLogger } from "../../utils/logger.js";
import {
  environment,
  location,
  clientUrl,
  tokenIssuer,
  tokenSecret,
} from "../../../config/index.js";

import { sendMail } from "../../services/index.js";
import jwt from "jsonwebtoken";

export const createAccount = async (req, res) => {
  const { email, password, username } = req.body;

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

    const newUser = new UserModel({ email, password, username });

    if (req.file) {
      const uploader = async (path) => uploadImage(path, "Images");
      const file = req.file;

      const newPath = await uploader(file?.path);
      fs.unlink(file?.path, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted");
        }
      });
      const userAvatar = await ImageModel.create({
        url: newPath?.url,
        publicId: newPath?.public_id,
      });

      newUser.avatar = userAvatar?._id;
    }

    const confirmationToken = await TokenModel.create({
      user: newUser._id,
    });

    await newUser.save();

    const confirmUrl = `${clientUrl}/register/confirm-account?token=${confirmationToken._doc.token}&user_id=${newUser._id}`;

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

    const token = jwt.sign(
      {
        user_id: newUser._id,
        email: newUser._doc.email,
        phone: newUser._doc.phone,
      },
      tokenSecret,
      { issuer: tokenIssuer, expiresIn: "2h" }
    );

    res.setHeader("Location", `${location}/account/${newUser._id}`);
    return res.status(201).json({
      data: {
        message:
          "Successfully registered, check your email for confirmation link, it expires in 24 hours",
        token,
      },
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
