import express from "express";
import mongoose from "mongoose";
import { check, param } from "express-validator";
import { upload } from "../../config/multer.js";
import { validationErrorHandler } from "../middlewares/validationErrorHandler.js";

import {
  createEvent,
  getEventById,
  getEvents,
  getEventsList,
} from "../controllers/Event.Controller.js";

const router = express.Router();

router.post(
  "/create",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  check("name")
    .exists()
    .withMessage("Please provide a valid event name")
    .isLength({ min: 5 })
    .withMessage("Event name should be a minimum is 5 characters"),
  check("description")
    .exists()
    .withMessage("Please provide a valid event description")
    .isLength({ min: 5 })
    .withMessage("Event description should be a minimum is 5 characters"),
  check("startDate")
    .exists()
    .withMessage("Please provide a valid event start date")
    .custom((value, _) => {
      if (Date.now() > value) {
        throw new Error("Start date should be greater than today's date.");
      }
      return true;
    }),
  check("endDate")
    .exists()
    .withMessage("Please provide a valid event end date")
    .custom((value, _) => {
      if (Date.now() > value) {
        throw new Error("End date should be greater than today's date.");
      }
      return true;
    })
    .custom((value, { req }) => {
      if (req.body.startDate > value) {
        throw new Error("End date should be greater than start date.");
      }
      return true;
    }),
  validationErrorHandler,
  createEvent
);

router.get(
  "/details/:eventId",
  param("eventId")
    .exists()
    .withMessage("Event Id is required")
    .custom((value, _) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("Invalid Event Id");
      }
      return true;
    }),
  validationErrorHandler,
  getEventById
);

router.get("/events", getEvents);

export default router;
