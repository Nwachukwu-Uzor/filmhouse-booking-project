import {
  TicketModel,
  EventModel,
  TicketTypeModel,
} from "../../models/index.js";

import { environment } from "../../../config/index.js";
import { developmentLogger, productionLogger } from "../../utils/logger.js";

export const deleteTicketForEvent = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await TicketModel.findByIdAndDelete(ticketId);
    if (!ticket) {
      return res.status(404).json({
        message: "Invalid Ticket Id",
      });
    }
    return res.status(204).json({ message: "Successfully deleted" });
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
