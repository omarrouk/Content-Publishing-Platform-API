const jwt = require("jsonwebtoken");
const AppError = require("./AppError");

exports.signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT secret is not configured", 500);
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError(error.message, 401);
  }
};
