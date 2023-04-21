import {
  TicketModel,
  EventModel,
  TicketTypeModel,
} from "../../models/index.js";

import { environment, location } from "../../../config/index.js";
import { developmentLogger, productionLogger } from "../../utils/logger.js";

export const createTicketForEvent = async (req, res) => {
  try {
    const { eventId, ticketTypeId, price } = req.body;
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event does not exist, please provide a valid event id",
      });
    }

    const ticketType = await TicketTypeModel.findById(ticketTypeId);

    if (!ticketType) {
      return res.status(404).json({
        message:
          "Ticket type does not exist, please provide a valid ticket type id",
      });
    }

    const existingTicket = await TicketModel.findOne({
      $and: [{ event: eventId, type: ticketType }],
    });

    if (existingTicket) {
      existingTicket.price = price;
      await existingTicket.save();
      res.setHeader(
        "Location",
        `${location}/tickets/${eventId}/${existingTicket._id}`
      );
      return res.status(201).json({
        message: `Price updated for ${ticketType?.typeName} ticket for ${event?.name}`,
      });
    }

    const newTicket = await TicketModel.create({
      type: ticketTypeId,
      event: eventId,
      price: price,
    });
    res.setHeader(
      "Location",
      `${location}/tickets/${eventId}/${newTicket._id}`
    );
    return res.status(201).json({
      message: `New ${ticketType?.typeName} ticket created for ${event?.name}`,
    });
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
