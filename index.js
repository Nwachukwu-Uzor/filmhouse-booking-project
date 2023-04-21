import express from "express";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";

import { productionLogger, developmentLogger } from "./src/utils/logger.js";
import { requestBodyLogger } from "./src/middlewares/requestBodyLogger.js";
import {
  port,
  environment,
  allowOrigins,
  vercelDeploy,
} from "./config/index.js";
import {
  bookingRouter,
  authRouter,
  eventRouter,
  ticketRouter,
} from "./src/routes/index.js";
import { dbConnection } from "./dbConnection.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { seedTicketTypes } from "./src/utils/seedTicketType.js";
import { seedSuperAdmin } from "./src/utils/seedSuperAdmin.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: function (origin, callback) {
    if (
      allowOrigins.indexOf(origin) !== -1 ||
      !origin ||
      origin.toString().toLowerCase().contains(vercelDeploy.toLowerCase())
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  cookieSession({
    name: "filmhouse-booking",
    keys: ["technovate"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
// app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
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

app.use(requestBodyLogger);

app.get("/health-check", (req, res) => {
  return res.status(200).json({ message: "App is running!" });
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

// Registers the route for authentication
app.use("/api/auth", authRouter);

// Register the route for booking
app.use("/api/booking", bookingRouter);

// Registers the route for events
app.use("/api/event", eventRouter);

// Registers the route for tickets
app.use("/api/ticket", ticketRouter);

app.listen(port, () => {
  dbConnection();
  if (environment === "Development") {
    developmentLogger.log("info", `Server is running at ${port}`);
  }
  console.log(`🚀 App is running at ${port}`);
});

seedSuperAdmin();
seedTicketTypes();

// 404 Route
app.use("*", (_req, res) => {
  return res.status(404).json({ message: "Route not found" });
});
