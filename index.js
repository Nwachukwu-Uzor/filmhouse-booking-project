import express from "express";
import expressWinston from "express-winston";
import { format, transports } from "winston";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";

import { productionLogger, developmentLogger } from "./src/utils/logger.js";
import { swaggerDocs } from "./src/utils/swagger.js";
import { port, environment } from "./config/index.js";
import { bookingRouter, authRouter } from "./src/routes/index.js";
import { dbConnection } from "./dbConnection.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { passportSetup } from "./src/utils/passport.js";
import session from "express-session";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

// const sess = session({
//   secret: "test-secret",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 100,
//   },
// });

// if (environment === "production") {
//   app.set("trust proxy", 1); // trust first proxy
//   sess.cookie.secure = true; // serve secure cookies
// }

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

// swaggerDocs(app, port);

/**
 * @openapi
 * /health-check
 * get:
 *  tag:
 *    - HealthCheck
 *    description: responds if app is running
 *    responses:
 *      200:
 *        description: app is running
 */
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
