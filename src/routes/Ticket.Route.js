import express from "express";
import { getTicketTypes } from "../controllers/Ticket.Controller.js";

const router = express.Router();

router.get("/types", getTicketTypes);

export default router;
