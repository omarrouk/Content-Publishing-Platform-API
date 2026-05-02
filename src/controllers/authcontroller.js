const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const jwtUtils = require("../utils/jwtUtils");
const emailUtils = require("../utils/emaiUtils");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!(username && email && password && firstName && lastName)) {
      throw new Error("some missed info are required");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser?.email === email) {
      throw new Error("this email is already used by another user");
    }
    if (existingUser?.username === username) {
      throw new Error("this username is already used by another user");
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

    res.status(200).json({
      status: "success",
      message: "user created successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "failed to signup",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error("email is required for login");

    if (!password) throw new Error("password is required for login");

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("wrong email or password");

    const isRightPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isRightPassword) throw new Error("wrong email or password");

    const token = jwtUtils.signToken({ id: user._id });

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "user logged in successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "failed to login",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
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
      user,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to logout",
      error: error.message,
    });
  }
};

exports.forgotMyPassword = async (req, res) => {
  try {
    const email = req.body?.email;
    if (!email) throw new Error("provide user email");

    const user = await User.findOne({ email });
    if (!user) throw new Error("no user found with this email");

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
      //TODO remove resetToken
      resetToken,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to complete forgot password",
      error: error.message,
    });
  }
};

exports.resetMyPassword = async (req, res) => {
  try {
    const resetToken = req.query?.resetToken;
    if (!resetToken) throw new Error("reset token is required");

    const newPassword = req.body?.newPassword;
    if (!newPassword) throw new Error("new password is required");

    const hashedResetToken = crypto
      .Hash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({ resetPasswordToken: hashedResetToken });
    if (!user || user.resetPasswordToken !== hashedResetToken)
      throw new Error("reset token is invalid");

    if (user.resetPasswordTokenExpiredAt < Date.now() + 30 * 1000)
      throw new Error("expired password reset tokem");
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
    return res.status(400).json({
      status: "fail",
      message: "failed to reset password",
      error: error.message,
    });
  }
};
