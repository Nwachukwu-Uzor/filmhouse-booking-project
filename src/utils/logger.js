import { createLogger, format, transports } from "winston";
import { mongoUri } from "../../config/index.js";
import "winston-mongodb";

export const productionLogger = createLogger({
  transports: [
    new transports.File({
      level: "warn",
      filename: "logsWarning.log",
    }),
    new transports.File({
      level: "error",
      filename: "logsError.log",
    }),
    new transports.MongoDB({
      db: mongoUri,
      collection: "logs",
      level: "error",
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.prettyPrint(),
    format.metadata()
  ),
});

export const developmentLogger = createLogger({
  transports: [
    new transports.Console({ level: "info" }),
    new transports.Console({ level: "debug" }),
    new transports.Console({ level: "trace" }),
    new transports.Console({ level: "warn" }),
    new transports.Console({ level: "error" }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.prettyPrint(),
    format.metadata(),
    format.colorize()
  ),
});
