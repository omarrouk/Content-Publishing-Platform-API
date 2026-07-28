const {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
} = require("../utils/dbErrorHandlers");

const errorHandler = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  if (process.env.NODE_ENV === "development") {
    console.log("error from development env");

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    console.log("error from production env");

    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    // 1. Intercept MongoDB/Mongoose Invalid ObjectID
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    // 2. Intercept MongoDB Duplicate Key Error (Code 11000)
    else if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    // 3. Intercept Mongoose Schema Validation Errors
    else if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }

    console.error("ERROR: ", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = errorHandler;
