// utils/dbErrorHandlers.js
const AppError = require("./AppError");

// Handles invalid IDs (e.g., Mongoose CastError / Invalid UUID in Postgres)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handles duplicate fields (e.g., MongoDB error code 11000 or Prisma P2002)
const handleDuplicateFieldsDB = (err) => {
  let value;

  if (err?.keyValue && typeof err.keyValue === "object") {
    const [field, fieldValue] = Object.entries(err.keyValue)[0] || [];

    if (field) {
      value = `${field}: ${fieldValue}`;
    }
  }

  if (!value && typeof err?.errmsg === "string") {
    const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
    value = match ? match[0] : err.errmsg;
  }

  if (!value && typeof err?.message === "string") {
    const match = err.message.match(/(["'])(\\?.)*?\1/);
    value = match ? match[0] : err.message;
  }

  const message = value
    ? `Duplicate field value: ${value}. Please use another value!`
    : "Duplicate field value found. Please use another value!";
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
