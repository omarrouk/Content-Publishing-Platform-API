const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwtUtils = require("../utils/jwtUtils");

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
