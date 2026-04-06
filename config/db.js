const mongoose = require("mongoose");

exports.connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database Connected Successfully...");
    })
    .catch((error) => {
      console.log(`Error in Database Connection: ${error}`);
    });
};
