import express from "express";
import { createBooking } from "../controllers/Booking/index.js";

const router = express.Router();

router.post("/create", createBooking);

export default router;
