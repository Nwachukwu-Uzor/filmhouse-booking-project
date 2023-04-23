import express from "express";
import { validateUserToken } from "../middlewares/validateUserToken.js";
import { validationErrorHandler } from "../middlewares/validationErrorHandler.js";
import { body } from "express-validator";
import { createBooking } from "../controllers/Booking/index.js";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/create",
  body("tickets")
    .exists()
    .withMessage("Tickets are required to create booking")
    .isArray({ min: 1 })
    .withMessage("Please provide a list of tickets to create booking")
    .custom((value) => {
      return value?.every(
        (ticket) =>
          mongoose.isValidObjectId(ticket?.ticketId) && !isNaN(ticket?.quantity)
      );
    })
    .withMessage("Invalid ticket Id provided"),
  validationErrorHandler,
  validateUserToken,
  createBooking
);

export default router;
