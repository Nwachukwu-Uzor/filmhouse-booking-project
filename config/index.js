const dotenv = require("dotenv");

dotenv.config();

const mongoUri =
  process.env.ENVIRONMENT === "Test"
    ? process.env.MONGO_DB_LOCAL_URI
    : process.env.MONGO_DB_LIVE_URI;

const port = process.env.PORT;

module.exports = {
  mongoUri,
  port,
};
