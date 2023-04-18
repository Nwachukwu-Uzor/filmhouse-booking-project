import express from "express";
import { getTicketTypes } from "../controllers/Tickets/index.js";

const router = express.Router();

router.get("/types", getTicketTypes);

export default router;
