const lodash = require("lodash");
const Post = require("../models/postModel");
const Follow = require("../models/followModel");

exports.getRandomUsersPosts = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const newestFirst = req.query.newestFirst ? { createdAt: -1 } : null;

    let posts = await Post.find()
      .sort(newestFirst)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("publisher", "username email firstName lastName");

    if (!newestFirst) {
      posts = lodash.shuffle(posts);
    }

    res.status(200).json({
      status: "success",
      message: "posts fetched successfully",
      length: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to get posts",
      error: error.message,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) throw new Error("please provide a text of your post");

    const publisherId = req.user.id;

    let photos;
    if (req.files) {
      photos = req.files.map((file) => file.path);
    }

    const post = await Post.create({ publisher: publisherId, text, photos });

    res.status(201).json({
      status: "success",
      message: "post created successfully",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to create a post",
      error: error.message,
    });
  }
};

exports.getMyFollowingsPosts = async (req, res) => {
  try {
    const user = req.user;

    const myFollowings = await Follow.find({ follower: user.id }).select(
      "following",
    );

    const myFollowingsIds = myFollowings.map(
      (followingRecord) => followingRecord.following,
    );

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const newestFirst = !!req.query.newestFirst;

    const posts = await Post.find({ publisher: { $in: myFollowingsIds } })
      .sort({ createdAt: newestFirst ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("publisher", "username email firstName lastName");

    res.status(200).json({
      status: "success",
      message: "followings posts fetched successfully",
      posts,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to get followings posts",
      error: error.message,
    });
  }
};

exports.editMyPost = async (req, res) => {
  try {
    const postId = req.params?.id;
    if (!postId) throw new Error("provide post id");

    const updatedText = req.body?.text;
    if (!updatedText) throw new Error("provide the updated post text");

    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        publisher: req.user.id,
      },
      {
        text: updatedText,
        editedAt: Date.now(),
      },
      { returnDocument: "after" },
    );

    if (!post) throw new Error("this user does not have a post with this id");

    res.status(200).json({
      status: "success",
      message: "edits are applied successfully",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to edit a post",
      error: error.message,
    });
  }
};

exports.deleteMyPost = async (req, res) => {
  try {
    const postId = req.params?.id;
    if (!postId) throw new Error("provide a post id");

    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        publisher: req.user.id,
      },
      {
        deletedAt: Date.now(),
      },
      { new: true },
    );

    if (!post) throw new Error("this user does not have a post with this id");

    res.status(200).json({
      status: "success",
      message: "post deleted successfully",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "failed to delete a post",
    });
  }
};
