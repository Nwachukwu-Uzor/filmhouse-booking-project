import express from "express";
import mongoose from "mongoose";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import { productionLogger, developmentLogger } from "./src/utils/logger.js";
import { swaggerDocs } from "./src/utils/swagger.js";
import cors from "cors";

import { mongoUri, port, environment } from "./config/index.js";
import { router as bookingRoute } from "./src/routes/Booking.Route.js";
import { dbConnection } from "./dbConnection.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(errorHandler);

if (environment === "Development") {
  app.use(
    expressWinston.logger({
      winstonInstance: developmentLogger,
      statusLevels: true,
    })
  );
} else {
  app.use(
    expressWinston.logger({
      winstonInstance: productionLogger,
      statusLevels: true,
    })
  );
}

app.get("/health-check", (req, res) => {
  return res.status(200).json({ message: "App is running!" });
});

app.post("/", (req, res) => {
  const { body } = req.body;
  return res
    .status(200)
    .json({ body: body, message: "Ok, body parser is working" });
});

app.get("/400", (req, res) => {
  return res.status(400).json({ message: "Error Occurred" });
});

app.get("/500", (req, res) => {
  return res.status(500).json({ message: "Error Occurred" });
});

app.get("/error", (req, res) => {
  throw new Error("Unable to proceed, error occurred");
});

const customErrorLogFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level}: ${meta?.message}`;
});

app.use(
  expressWinston.errorLogger({
    transports: [
      new transports.File({
        filename: "logsInternalError.log",
      }),
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      customErrorLogFormat
    ),
  })
);

// Register the route for booking
app.use("/api/booking", bookingRoute);

swaggerDocs(app, port);

app.listen(port, () => {
  dbConnection();
  if (environment === "Development") {
    developmentLogger.log("info", `Server is running at ${port}`);
  }
});

// 404 Route
app.use("*", (req, res) => {
  return res.status(404).json({ message: "Route not found" });
});
