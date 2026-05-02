const jwtUtils = require("../utils/jwtUtils");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new Error("missed token. please login");

  try {
    const decoded = jwtUtils.verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error("user is no longer exists");
    }

    if (user.loggedOutAt && user.loggedOutAt.getTime() / 1000 > decoded.iat) {
      throw new Error("login and try again");
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "an error when authorize the user",
      error: error.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return res.status(400).json({
        status: "failed",
        message: "not allowed to complete this function",
      });

    next();
  };
};
