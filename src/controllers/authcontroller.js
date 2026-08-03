const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const jwtUtils = require("../utils/jwtUtils");
const emailUtils = require("../utils/emailUtils");
const AppError = require("../utils/AppError");

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!(username && email && password && firstName && lastName)) {
      throw new AppError("some missed info are required", 400);
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser?.email === email) {
      throw new AppError("this email is already used by another user", 400);
    }
    if (existingUser?.username === username) {
      throw new AppError("this username is already used by another user", 400);
    }

    const profilePhoto = req.file ? req.file.path : null;

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      profilePhoto,
    });

    const token = jwtUtils.signToken({ id: user._id });

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "user created successfully",
      //TODO remove token
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new AppError("email is required for login", 400);

    if (!password) throw new AppError("password is required for login", 400);

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new AppError("wrong email or password", 401);

    const isRightPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isRightPassword) throw new AppError("wrong email or password", 401);

    const token = jwtUtils.signToken({ id: user._id });

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "user logged in successfully",
      //TODO remove token
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        loggedOutAt: Date.now(),
      },
      {
        returnDocument: "after",
      },
    );

    res.status(200).json({
      status: "success",
      message: "logged out successfully",
      //TODO remove user
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotMyPassword = async (req, res, next) => {
  try {
    const email = req.body?.email;
    if (!email) throw new AppError("provide user email", 400);

    const user = await User.findOne({ email });
    if (!user) throw new AppError("no user found with this email", 404);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetHashToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetHashToken;
    user.resetPasswordTokenExpiredAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await emailUtils.sendEmail({
      to: user.email,
      subject: "Reset Password - Content Publishing Platform",
      text: `${process.env.BASE_URL}:${process.env.port}/api/v1/users/reset-password?${resetToken}`,
    });

    res.status(200).json({
      status: "success",
      message: "reset token sent successfully",
      //TODO remove resetToken and user
      resetToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetMyPassword = async (req, res, next) => {
  try {
    const resetToken = req.query?.resetToken;
    if (!resetToken) throw new AppError("reset token is required", 400);

    const newPassword = req.body?.newPassword;
    if (!newPassword) throw new AppError("new password is required", 400);

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({ resetPasswordToken: hashedResetToken });
    if (!user || user.resetPasswordToken !== hashedResetToken)
      throw new AppError("reset token is invalid", 400);

    if (user.resetPasswordTokenExpiredAt < Date.now() + 30 * 1000)
      throw new AppError("expired password reset token", 400);
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiredAt = null;
    user.loggedOutAt = Date.now();
    await user.save();

    res.status(200).json({
      status: "success",
      message: "password resetted successfully",
    });
  } catch (error) {
    next(error);
  }
};
