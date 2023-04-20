import { TicketModel, EventModel } from "../../models/index.js";

import { environment } from "../../../config/index.js";
import { developmentLogger, productionLogger } from "../../utils/logger.js";

export const getTicketsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await EventModel.findById(eventId).select(
      "-banner -galleryImages -description"
    );

    if (!event) {
      return res.status(404).json({
        message: "Event does not exist, please provide a valid event id",
      });
    }

    const tickets = await TicketModel.find({ event: eventId }).populate("type");

    return res.status(200).json({ tickets, event });
  } catch (error) {
    if (environment === "Development") {
      developmentLogger.log("error", JSON.stringify(error));
    } else {
      productionLogger.log("error", JSON.stringify(error));
    }
    return res
      .status(500)
      .json({ error: error?.message ?? "Internal Server Error" });
  }
};
