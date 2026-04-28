const mongoose = require("mongoose");
const User = require("../models/userModel");
const Post = require("../models/postModel");

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
