import * as dotenv from "dotenv";

dotenv.config();

export const environment = process.env.ENVIRONMENT ?? "production";

export const mongoUri =
  process.env.ENVIRONMENT === "Development"
    ? process.env.MONGO_DB_LOCAL_URI
    : process.env.MONGO_DB_LIVE_URI;

export const port = process.env.PORT;
export const location =
  process.env.ENVIRONMENT === "Development"
    ? "http://localhost:5000/api"
    : "https://filmhouse-cinema.onrender.com/api";
