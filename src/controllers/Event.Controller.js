import fs from "fs";
import { validationResult } from "express-validator";

import { EventModel, ImageModel } from "../models/index.js";
import {
  environment,
  location,
  clientUrl,
  tokenIssuer,
  tokenSecret,
} from "../../config/index.js";
import { developmentLogger, productionLogger } from "../utils/logger.js";
import { uploadImage } from "../services/imageService.js";

export const createEvent = async (req, res) => {
  const { name, description, startDate, endDate } = req.body;

  try {
    const { image, images } = req.files;
    if (!image) {
      return res
        .status(400)
        .json({ message: "Please provide the banner for this event" });
    }

    if (!images) {
      return res.status(400).json({
        message:
          "Please provide the gallery images for this event for this event",
      });
    }

    const newEventData = {
      name,
      description,
      startDate,
      endDate,
    };

    const uploader = async (path) => uploadImage(path, "Images");

    const newPath = await uploader(image[0]?.path);
    fs.unlink(image[0]?.path, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted");
      }
    });

    const bannerImage = await ImageModel.create({
      url: newPath?.url,
    });

    newEventData.banner = bannerImage._id;

    const eventGalleryImage = [];

    for (let galleryImage of images) {
      const newPath = await uploader(galleryImage?.path);
      fs.unlink(galleryImage?.path, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted");
        }
      });

      const gallery = await ImageModel.create({
        url: newPath?.url,
      });

      eventGalleryImage.push(gallery._id);
    }

    newEventData.galleryImages = eventGalleryImage;

    const newEvent = await EventModel.create(newEventData);

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
  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId)
      .select("-__v -createdOn")
      .populate({ path: "banner", select: "url -_id" })
      .populate({ path: "galleryImages", select: "url -_id" });

    if (!event) {
      return res.status(404).json({ message: "Invalid event" });
    }

    return res.status(200).json({
      data: {
        events: event._doc,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

export const getEventsList = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId).select("name description");

    if (!event) {
      return res.status(404).json({ message: "Invalid event" });
    }

    return res.status(200).json({
      data: {
        events: event._doc,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const page = req?.query?.page ?? 1;
    const size = req?.query?.size ?? 15;

    const events = await EventModel.find()
      .limit(size)
      .skip((page - 1) * size)
      .populate({ path: "banner", select: "url -_id" })
      .populate({ path: "galleryImages", select: "url -_id" })
      .exec();

    const eventsCount = await EventModel.count();

    if (!events) {
      return res.status(404).json({ message: "No more events available." });
    }

    return res.status(200).json({ event: events, totalCount: eventsCount });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
