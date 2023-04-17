import { TicketTypeModel } from "../models/index.js";

export const getTicketTypes = async (_req, res) => {
  try {
    const ticketTypes = await TicketTypeModel.find().select("-__v");
    return res.json({ ticketTypes });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
