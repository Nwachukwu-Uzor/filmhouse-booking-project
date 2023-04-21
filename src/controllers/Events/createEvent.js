import { EventModel, ImageModel } from "../../models/index.js";
import { environment, location } from "../../../config/index.js";
import { developmentLogger, productionLogger } from "../../utils/logger.js";
import { uploadImage } from "../../services/imageService.js";
import { deleteFiles } from "../../utils/deleteFiles.js";

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

    const bannerImage = await ImageModel.create({
      url: newPath?.url,
      publicId: newPath?.public_id,
    });

    newEventData.banner = bannerImage._id;

    const eventGalleryImage = [];

    for (let galleryImage of images) {
      const newPath = await uploader(galleryImage?.path);

      const gallery = await ImageModel.create({
        url: newPath?.url,
        publicId: newPath?.public_id,
      });

      eventGalleryImage.push(gallery._id);
    }

    newEventData.galleryImages = eventGalleryImage;

    const newEvent = await EventModel.create(newEventData);

    if (!newEvent) {
      deleteFiles();
      return res.status(400).json({ message: "Unable to create event" });
    }

    res.setHeader("Location", `${location}/event/details/${newEvent._id}`);

    deleteFiles();
    return res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    deleteFiles();
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
