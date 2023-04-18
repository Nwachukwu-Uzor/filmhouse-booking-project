import { EventModel } from "../../models/index.js";

// This route returns a list of events ids for the get static paths method for next js
export const getEventsIds = async (req, res) => {
  try {
    const events = await EventModel.find().select("_id");
    return res.status(200).json({ eventIds: events });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
