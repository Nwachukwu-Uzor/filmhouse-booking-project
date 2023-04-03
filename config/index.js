import * as dotenv from "dotenv";

dotenv.config();

export const environment = process.env.ENVIRONMENT ?? "production";

export const mongoUri =
  process.env.ENVIRONMENT === "Development"
    ? process.env.MONGO_DB_LOCAL_URI
    : process.env.MONGO_DB_LIVE_URI;

export const port = process.env.PORT;
