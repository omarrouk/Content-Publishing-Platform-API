// utils/dbErrorHandlers.js
const AppError = require("./AppError");

// Handles invalid IDs (e.g., Mongoose CastError / Invalid UUID in Postgres)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handles duplicate fields (e.g., MongoDB error code 11000 or Prisma P2002)
const handleDuplicateFieldsDB = (err) => {
  // Extracts the duplicate value from the MongoDB error message string
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handles validation failures (e.g., missing required fields, password too short)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

module.exports = {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
};
