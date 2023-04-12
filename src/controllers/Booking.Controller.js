import {BookingModel} from "../models/index.js";
import { generateBookingNumber } from "../utils/generateBookingNumber.js";
import { environment, location } from "../../config/index.js";
import { developmentLogger, productionLogger } from "../utils/logger.js";

export const createBooking = async (req, res) => {
  const { eventId, userName } = req.body;

  const logMessage = `headers: ${JSON.stringify(
    req.headers
  )} body: ${JSON.stringify(req.body)}`;

  if (environment === "Development") {
    developmentLogger.log("info", logMessage);
  } else {
    productionLogger.log("info", logMessage);
  }

  try {
    let bookingNumber = generateBookingNumber();

    while (await BookingModel.findOne({ bookingNumber: bookingNumber })) {
      bookingNumber = generateBookingNumber();
    }
    const newBookingNumber = await BookingModel.create({
      eventId,
      userName,
      bookingNumber,
    });

    res.setHeader("Location", `${location}/booking/${newBookingNumber._id}`);
    return res.status(201).json({ message: "Booking Created" });
    return res.status(200).send({ message: "Booking Route Hit!" });
  } catch (error) {
    const logMessage = JSON.stringify(error);
    if (environment === "Development") {
      developmentLogger.log("error", JSON.stringify(error));
    } else {
      productionLogger.log("error", JSON.stringify(error));
    }
    return res
      .status(400)
      .json({ message: "An error occurred while creating booking" });
  }
};
