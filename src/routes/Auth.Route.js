import express from "express";
import { createAccount } from "../controllers/Auth.Controller.js";

const router = express.Router();

router.post("/register", createAccount)

export default router;
