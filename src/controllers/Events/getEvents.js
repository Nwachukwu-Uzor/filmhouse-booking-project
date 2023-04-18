import { EventModel } from "../../models/index.js";

export const getEventsList = async (req, res) => {
  const { eventId } = req.params;

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

export const getEvents = async (req, res) => {
  try {
    const page = req?.query?.page ?? 1;
    const size = req?.query?.size ?? 15;

    const events = await EventModel.find()
      .select("-galleryImages -__v")
      .limit(size)
      .skip((page - 1) * size)
      .populate({ path: "banner", select: "url -_id" })
      .exec();

    const eventsCount = await EventModel.count();

    const totalPages = Math.ceil(eventsCount / size);

    if (!events) {
      return res.status(404).json({ message: "No more events available." });
    }

    return res
      .status(200)
      .json({ events: events, totalCount: eventsCount, page, totalPages });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
