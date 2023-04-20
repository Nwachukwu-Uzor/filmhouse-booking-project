import { EventModel, ImageModel } from "../../models/index.js";
import { environment } from "../../../config/index.js";
import { developmentLogger, productionLogger } from "../../utils/logger.js";

import { deleteImage } from "../../services/imageService.js";

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findByIdAndDelete(eventId)
      .populate("banner")
      .populate("galleryImages");

    if (!event) {
      return res.status(404).json({ message: "Invalid event" });
    }

    const bannerImage = event?.banner?._doc?.publicId;
    if (bannerImage) {
      await deleteImage(bannerImage);
      await ImageModel.findByIdAndDelete(event?.banner?._id);
    }

    const galleryImages = event?.galleryImages;

    for (let image of galleryImages) {
      const img = image?._doc?.publicId;
      if (img) {
        await deleteImage(img);
        await ImageModel.findByIdAndDelete(image?._id);
      }
    }

    return res.status(204).json({
      message: "Event deleted successfully",
    });
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
