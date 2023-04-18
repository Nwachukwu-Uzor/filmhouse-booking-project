import { EventModel } from "../../models/index.js";

export const getEventsList = async (req, res) => {

  try {
    const events = await EventModel.find().select("name description");

    if (!events) {
      return res.status(404).json({ message: "Invalid event" });
    }

    return res.status(200).json({
      events: events,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
