import { EventModel } from "../../models/index.js";
import { environment } from "../../../config/index.js";
import { developmentLogger, productionLogger } from "../../utils/logger.js";

export const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId)
      .select("-__v -createdOn")
      .populate({ path: "banner", select: "url -_id" })
      .populate({ path: "galleryImages", select: "url _id" });

    if (!event) {
      return res.status(404).json({ message: "Invalid event" });
    }

    return res.status(200).json({
      event: event._doc,
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
