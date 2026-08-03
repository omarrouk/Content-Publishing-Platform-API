const express = require("express");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./utils/AppError");

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle 404 - Route Not Found
app.use((req, res, next) => {
  next(new AppError("Route Not Found", 404));
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
