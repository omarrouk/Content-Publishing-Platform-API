const express = require("express");

const app = express();

app.use("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "app works well.",
  });
});

module.exports = { app };
