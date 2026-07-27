const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "app works well.",
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route Not Found",
  });
});

module.exports = app;
