import express from "express";
import passport from "passport";
import fs from "fs";

import { createAccount, loginUser } from "../controllers/Auth.Controller.js";
import { clientUrl } from "../../config/index.js";
import { upload } from "../../config/multer.js";
const router = express.Router();

router.post("/register", upload.single("image"), createAccount);
router.post("/login", loginUser);

// OAuth Routes
router.get("/login/failed", (req, res) => {
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
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: clientUrl,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: clientUrl,
    failureRedirect: "/login/failed",
  })
);

export default router;
