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

export const emailAddress = process.env.EMAIL_ADDRESS;
export const mailjetApiKey = process.env.MAILJET_API_KEY;
export const mailjetApiSecret = process.env.MAILJET_API_SECRET;
export const googleClientId = process.env.GOOGLE_CLIENT_ID;
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
export const googleClientRedirectUrl =
  environment === "Development"
    ? "http://localhost:3000"
    : "https://film-book-ui.vercel.app/";
