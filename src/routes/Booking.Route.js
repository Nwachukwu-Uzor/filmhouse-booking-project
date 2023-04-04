import express from "express";
import { createBooking } from "../controllers/Booking.Controller.js";

const router = express.Router();

router.post("/create", createBooking);

export { router };
