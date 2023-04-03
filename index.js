import express from "express";
import mongoose from "mongoose";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import { productionLogger, developmentLogger } from "./src/utils/logger.js";

import { mongoUri, port, environment } from "./config/index.js";
import "winston-mongodb";

const app = express();

app.use(express.json());

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

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "App is running" });
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

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
