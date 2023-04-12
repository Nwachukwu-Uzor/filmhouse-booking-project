import express from "express";
import passport from "passport";
import fs from "fs";

import { createAccount } from "../controllers/Auth.Controller.js";
import { clientUrl } from "../../config/index.js";
import { upload } from "../../config/multer.js";
import { uploadImage } from "../services/imageService.js";
const router = express.Router();

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

router.post("/register", createAccount);

router.post("/uploadFile", upload.single("image"), async (req, res) => {
  try {
    const uploader = async (path) => uploadImage(path, "Images");
    const currentDirection = process.cwd();
    const file = req.file;

    const newPath = await uploader(file?.path);
    fs.unlink(file?.path);

    return res
      .status(200)
      .json({ message: "File Upload Success", data: { path: newPath } });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error.message}` });
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
