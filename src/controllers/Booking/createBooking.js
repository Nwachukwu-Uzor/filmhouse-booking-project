import {
  BookingModel,
  TicketModel,
  EventTicketModel,
} from "../../models/index.js";
import { location } from "../../../config/index.js";

export const createBooking = async (req, res) => {
  const { tickets, userEmail } = req.body;

  try {
    let ticketsAreValid = true;
    let eventTicketsToCreate = [];
    let errorMessage = "";

    for (let ticket of tickets) {
      const existingTicket = await TicketModel.findById(
        ticket?.ticketId
      ).populate("event");

      if (!existingTicket) {
        errorMessage = "An invalid ticket id was provided";
        ticketsAreValid = false;
        break;
      }

      if (existingTicket?.event?._id.toString() !== ticket?.eventId) {
        errorMessage = "Event Id provided for a ticket does not match the event id for the ticket";
        ticketsAreValid = false;
        break;
      }

      if (ticket?.isValid?.event?.startDate > Date.now()) {
        errorMessage = "Event cannot be booked, it has already started";
        ticketsAreValid = false;
        break;
      }
      const ticketsForType = new Array(ticket?.quantity).fill({
        ticket: ticket?.ticketId,
        price: existingTicket?.price,
      });
      eventTicketsToCreate = [...eventTicketsToCreate, ...ticketsForType];
    }

    if (!ticketsAreValid) {
      return res
        .status(400)
        .json({ message: errorMessage ?? "Unable to process request" });
    }

    const newBooking = await BookingModel.create({
      user: req?.user?._id,
      userEmail: req?.user?.email ?? userEmail,
    });

    if (!newBooking) {
      return res.status(400).json({ message: "Unable to create new booking" });
    }

    eventTicketsToCreate = eventTicketsToCreate.map((ticket) => ({
      ...ticket,
      booking: newBooking?._id,
    }));

    const ticketsCreated = await EventTicketModel.insertMany(
      eventTicketsToCreate
    );

    if (!ticketsCreated) {
      return res.status(400).json({ message: "Ticket Generation Failed" });
    }

    res.setHeader("Location", `${location}/booking/${newBooking._id}`);
    return res.status(201).json({ message: "Booking Created" });
  } catch (error) {
    return res.status(500).json({
      message: `An error occurred while creating booking: ${error?.message}`,
    });
  }
};
