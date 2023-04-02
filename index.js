const express = require("express");
const mongoose = require("mongoose");

const { BookingModel } = require("./src/models/Booking.js");

const { mongoUri, port } = require("./config/index.js");

const app = express();

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successful");
    return BookingModel.create({
      bookingNumber: "123456",
      userName: "uzor-nwachukwu",
    });
  })
  .then((booking) => {
    console.log(booking);
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(mongoUri);
  console.log(`Server is running on ${port}`);
});
