import { environment, location } from "../../config/index.js";
import { developmentLogger, productionLogger } from "../utils/logger.js";

export const requestBodyLogger = async (req, res, next) => {
  const logMessage = `headers: ${JSON.stringify(
    req.headers
  )} body: ${JSON.stringify(req.body)}`;

  if (environment === "Development") {
    developmentLogger.log("info", logMessage);
  } else {
    productionLogger.log("info", logMessage);
  }

  return next();
};
