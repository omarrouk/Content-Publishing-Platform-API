const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Follow = require("../models/followModel");
const AppError = require("../utils/AppError");

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError("provide a valid Id", 400);
    }

    const user = await User.findById(userId).select("-email");
    const posts = await Post.find({ publisher: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      message: "user account fitched successfully",
      user,
      numOfPosts: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = {};

    if (req.body.username) {
      updates.username = req.body.username;
    }
    if (req.body.email) {
      updates.email = req.body.email;
    }
    if (req.body.firstName) {
      updates.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      updates.lastName = req.body.lastName;
    }
    if (req.file) {
      updates.profilePhoto = req.file.path;
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      returnDocument: "after",
    });

    res.status(200).json({
      status: "success",
      message: "profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const followingId = req.params?.id;
    if (!followingId) throw new AppError("provide a valid follwing id", 400);

    const followerId = req.user.id;

    if (followingId === followerId) {
      throw new AppError("can`t follow yourself", 400);
    }

    const follow = await Follow.create({
      follower: followerId,
      following: followingId,
    });

    res.status(201).json({
      status: "success",
      message: "follow created successfully",
      follow,
    });
  } catch (error) {
    next(error);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const followingId = req.params?.id;
    if (!followingId) throw new AppError("provide a valid follwing id", 400);

    const followerId = req.user.id;

    if (followingId === followerId) {
      throw new AppError("can`t unfollow yourself", 400);
    }

    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    res.status(200).json({
      status: "success",
      message: "unfollowed successfully",
      follow,
    });
  } catch (error) {
    next(error);
  }
};

exports.changeMyPassword = async (req, res, next) => {
  try {
    const currentPassword = req.body?.currentPassword;
    if (!currentPassword)
      throw new AppError("enter your current password", 400);

    const newPassword = req.body?.newPassword;
    if (!newPassword) throw new AppError("enter the new password", 400);

    if (currentPassword === newPassword)
      throw new AppError("can`t use the same password", 400);

    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");

    const isCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPassword)
      throw new AppError("current password is wrong", 401);

    user.password = newPassword;
    user.loggedOutAt = Date.now();
    await user.save();

    res.status(200).json({
      status: "success",
      message: "password changed successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params?.userId;
    if (!userId) throw new AppError("provide a valid user id", 400);

    const userRole = req.body?.newRole.toUpperCase();
    if (!userRole || !["ADMIN", "USER"].includes(userRole))
      throw new AppError("provide a valid user role", 400);

    const user = await User.findByIdAndUpdate(
      userId,
      { role: userRole },
      { returnDocument: "after" },
    );

    res.status(200).json({
      status: "success",
      message: "user role updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.params?.id;
    if (!userId) throw new AppError("provide a valid user id", 400);

    const user = await User.findByIdAndUpdate(
      userId,
      { deletedAt: Date.now() },
      { returnDocument: "after" },
    );

    res.status(200).json({
      status: "success",
      message: "user deleted successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
