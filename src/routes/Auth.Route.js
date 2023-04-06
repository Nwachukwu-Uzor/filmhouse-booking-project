import express from "express";
import passport from "passport";

import { createAccount } from "../controllers/Auth.Controller.js";
import { googleClientRedirectUrl } from "../../config/index.js";

const router = express.Router();

router.get("/login/failed", (req, res) => {
  return res.status(404).json({ message: "Login Failed" });
});

router.get("/logout", (req, res) => {
  req?.logout();
  res.redirect(googleClientRedirectUrl);
});

router.get("/login/success", (req, res) => {
  if (req?.user) {
    console.log(req.user, "I'm here");
    return res
      .status(200)
      .json({ message: "login success", data: { user: req?.user } });
  }
});
router.post("/register", createAccount);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: googleClientRedirectUrl,
    failureRedirect: "/login/failed",
  })
);

export default router;
