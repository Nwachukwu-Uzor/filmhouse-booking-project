import { BookingModel } from "../../models/index.js";
import { location } from "../../../config/index.js";

export const createBooking = async (req, res) => {
  const { eventId, userName, ticket, price, userEmail, userId } = req.body;

  try {
    const newBookingNumber = await BookingModel.create({
      eventId,
      userName,
      price,
      ticket,
      userEmail,
      user: userId,
    });

    res.setHeader("Location", `${location}/booking/${newBookingNumber._id}`);
    return res.status(201).json({ message: "Booking Created" });
  } catch (error) {
    return res.status(500).json({
      message: `An error occurred while creating booking: ${error?.message}`,
    });
  }
};
