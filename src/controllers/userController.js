const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Follow = require("../models/followModel");

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("provide a valid Id");
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
    return res.status(400).json({
      status: "fail",
      message: "failed to get user",
      error: error.message,
    });
  }
};

exports.updateMyProfile = async (req, res) => {
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
    return res.status(400).json({
      status: "fail",
      message: "failed to update profile",
      error: error.message,
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const followingId = req.params?.id;
    if (!followingId) throw new Error("provide a valid follwing id");

    const followerId = req.user.id;

    if (followingId === followerId) {
      throw new Error("can`t follow yourself");
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
    return res.status(400).json({
      status: "fail",
      message: "failed to follow user",
      error: error.message,
    });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followingId = req.params?.id;
    if (!followingId) throw new Error("provide a valid follwing id");

    const followerId = req.user.id;

    if (followingId === followerId) {
      throw new Error("can`t unfollow yourself");
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
    return res.status(400).json({
      status: "fail",
      message: "failed to unfollow user",
      error: error.message,
    });
  }
};

exports.changeMyPassword = async (req, res) => {
  try {
    const currentPassword = req.body?.currentPassword;
    if (!currentPassword) throw new Error("enter your current password");

    const newPassword = req.body?.newPassword;
    if (!newPassword) throw new Error("enter the new password");

    if (currentPassword === newPassword)
      throw new Error("can`t use the same password");

    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");

    const isCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPassword) throw new Error("current password is wrong");

    user.password = newPassword;
    user.loggedOutAt = Date.now();
    await user.save();

    res.status(200).json({
      status: "success",
      message: "password changed successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to change your password",
      error: error.message,
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params?.userId;
    if (!userId) throw new Error("provide a valid user id");

    const userRole = req.body?.newRole.toUpperCase();
    if (!userRole || !["ADMIN", "USER"].includes(userRole))
      throw new Error("provide a valid user role");

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
    return res.status(400).json({
      status: "fail",
      message: "failed to change user role",
      error: error.message,
    });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params?.id;
    if (!userId) throw new Error("provide a valid user id");

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
    return res.status(400).json({
      status: "fail",
      message: "failed to delete the user",
      error: error.message,
    });
  }
};
