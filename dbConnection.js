import mongoose from "mongoose";
import { mongoUri } from "./config/index.js";
import { UserModel } from "./src/models/index.js";

export function dbConnection() {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log(`✅ Connection Successful`);
    })
    .catch((err) => console.log(err));
}
