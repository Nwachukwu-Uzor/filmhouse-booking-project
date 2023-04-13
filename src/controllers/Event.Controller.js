import { validationResult } from "express-validator";

import { EventModel } from "../models/index.js";
import {
  environment,
  location,
  clientUrl,
  tokenIssuer,
  tokenSecret,
} from "../../config/index.js";
import { developmentLogger, productionLogger } from "../utils/logger.js";

export const createEvent = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { eventName, eventDescription, startDate, endDate } = req.body;

  try {
    const newEvent = await EventModel.create({
      eventName,
      eventDescription,
      startDate,
      endDate,
    });

    if (!newEvent) {
      return res.status(400).json({ message: "Unable to create event" });
    }

    res.setHeader("Location", `${location}/event/${newEvent._id}`);

    return res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    if (environment === "Development") {
      developmentLogger.log("error", JSON.stringify(error));
    } else {
      productionLogger.log("error", JSON.stringify(error));
    }

    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

export const getEventById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Invalid event" });
    }

    return res.status(200).json({
      data: {
        event: event._doc,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
