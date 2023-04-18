import { EventModel } from "../../models/index.js";

export const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId)
      .select("-__v -createdOn")
      .populate({ path: "banner", select: "url -_id" })
      .populate({ path: "galleryImages", select: "url _id" });

    if (!event) {
      return res.status(404).json({ message: "Invalid event" });
    }

    return res.status(200).json({
      event: event._doc,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};
