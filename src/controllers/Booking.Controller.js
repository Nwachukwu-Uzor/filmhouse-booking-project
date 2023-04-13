import { BookingModel } from "../models/index.js";
import { generateIdentificationCode } from "../utils/generateIdentificationCode.js";

export const createBooking = async (req, res) => {
  const { eventId, userName } = req.body;

  try {
    let bookingNumber = generateIdentificationCode(15, "FHB");

    while (await BookingModel.findOne({ bookingNumber: bookingNumber })) {
      bookingNumber = generateIdentificationCode(15, "FHB");
    }
    const newBookingNumber = await BookingModel.create({
      eventId,
      userName,
      bookingNumber,
    });

    res.setHeader("Location", `${location}/booking/${newBookingNumber._id}`);
    return res.status(201).json({ message: "Booking Created" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "An error occurred while creating booking" });
  }
};
