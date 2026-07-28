const mongoose = require("mongoose");

connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Database Connected Successfully...");
  });
};

module.exports = connectDB;
