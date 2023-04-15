import express from "express";
import mongoose from "mongoose";
import { passportSetup } from "../utils/passport.js";
import { check, query } from "express-validator";

import {
  createAccount,
  loginUser,
  verifyAccountEmail,
} from "../controllers/Auth.Controller.js";
import { clientUrl } from "../../config/index.js";
import { upload } from "../../config/multer.js";
import { validationErrorHandler } from "../middlewares/validationErrorHandler.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("image"),
  check("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 7 })
    .withMessage("Password must be at least 7 characters"),
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  validationErrorHandler,
  createAccount
);

router.post(
  "/login",
  check("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 7 })
    .withMessage("Password must be at least 7 characters"),
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  validationErrorHandler,
  loginUser
);

router.get(
  "/verify-email",
  query("user_id")
    .exists()
    .withMessage("User Id must be provided in the query")
    .custom((value, _) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("Invalid Event Id");
      }
      return true;
    }),
  query("token").exists().withMessage("Please provide a valid token"),
  validationErrorHandler,
  verifyAccountEmail
);

// OAuth Routes
router.get("/login/failed", (_req, res) => {
  return res.status(404).json({ message: "Login Failed" });
});

router.get("/logout", (req, res) => {
  req?.logout();
  res.redirect(clientUrl);
});

router.get("/login/success", (req, res) => {
  if (req?.user) {
    console.log(req.user, "I'm here");
    return res
      .status(200)
      .json({ message: "login success", data: { user: req?.user } });
  }
});

router.get(
  "/google/signup",
  passportSetup.authenticate("google-signup", { scope: ["profile", "email"] })
);

router.get(
  "/google/signup/callback",
  passportSetup.authenticate("google-signup", {
    successRedirect: clientUrl,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/google/login",
  passportSetup.authenticate("google-login", { scope: ["profile", "email"] })
);

router.get(
  "/google/login/callback",
  passportSetup.authenticate("google-login", {
    successRedirect: clientUrl,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/facebook",
  passportSetup.authenticate("facebook", { scope: ["profile"] })
);

router.get(
  "/facebook/callback",
  passportSetup.authenticate("facebook", {
    successRedirect: clientUrl,
    failureRedirect: "/login/failed",
  })
);

export default router;
