const jwtUtils = require("../utils/jwtUtils");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("missed token. please login", 401));

  try {
    const decoded = jwtUtils.verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError("user is no longer exists", 401);
    }

    if (user.loggedOutAt && user.loggedOutAt.getTime() / 1000 > decoded.iat) {
      throw new AppError("login and try again", 401);
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return next(new AppError("not allowed to complete this function", 403));

    return next();
  };
};
