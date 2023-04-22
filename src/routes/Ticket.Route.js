import express from "express";
import mongoose from "mongoose";

import { check, param } from "express-validator";
import {
  getTicketTypes,
  createTicketForEvent,
  getTicketsForEvent,
  deleteTicketForEvent,
} from "../controllers/Tickets/index.js";
import { validationErrorHandler } from "../middlewares/validationErrorHandler.js";

const router = express.Router();

router.get("/types", getTicketTypes);

router.post(
  "/create-ticket-for-event",
  check("eventId")
    .exists()
    .withMessage("Event Id is required")
    .custom((value, _) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("Invalid Event Id");
      }
      return true;
    }),
  check("ticketTypeId")
    .exists()
    .withMessage("Ticket Type Id is required")
    .custom((value, _) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("Invalid Ticket Type Id");
      }
      return true;
    }),
  check("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value, _) => {
      if (Number(value) < 0) {
        throw new Error("Price must be greater than 0");
      }
      return true;
    }),
  validationErrorHandler,
  createTicketForEvent
);

router.get(
  "/:eventId/tickets",
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
  getTicketsForEvent
);

router.post(
  "/create-ticket-for-event",
  check("eventId")
    .exists()
    .withMessage("Event Id is required")
    .custom((value, _) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("Invalid Event Id");
      }
      return true;
    }),
  check("ticketTypeId")
    .exists()
    .withMessage("Ticket Type Id is required")
    .custom((value, _) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("Invalid Ticket Type Id");
      }
      return true;
    }),
  check("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value, _) => {
      if (Number(value) < 0) {
        throw new Error("Price must be greater than 0");
      }
      return true;
    }),
  validationErrorHandler,
  createTicketForEvent
);

router.delete(
  "/:ticketId",
  param("ticketId")
    .exists()
    .withMessage("Ticket Id is required")
    .custom((value, _) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("Invalid Ticket Id");
      }
      return true;
    }),
  validationErrorHandler,
  deleteTicketForEvent
);
export default router;
