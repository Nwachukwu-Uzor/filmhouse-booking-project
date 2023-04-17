import { TicketTypeModel } from "../models/index.js";

const defaultTicketTypes = [
  { typeName: "Regular" },
  { typeName: "VIP" },
  { typeName: "Classic" },
];

export const seedTicketTypes = async () => {
  try {
    const totalTicketCount = await TicketTypeModel.countDocuments();
    if (totalTicketCount > 0) {
      console.log("Ticket Types Collection is not empty");
      return;
    }
    await TicketTypeModel.insertMany(defaultTicketTypes);
    console.log("Default Ticket Types Inserted");
  } catch (error) {
    console.log(error?.message);
  }
};
