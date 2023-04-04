import mongoose from "mongoose";
import { mongoUri } from "./config/index.js";

export function dbConnection() {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection Successful");
    })
    .catch((err) => console.log(err));
}
