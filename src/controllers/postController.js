const lodash = require("lodash");
const Post = require("../models/postModel");
const Follow = require("../models/followModel");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");
const AppError = require("../utils/AppError");

exports.getRandomUsersPosts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const newestFirst = req.query.newestFirst ? { createdAt: -1 } : null;
    //TODO get number of likes, number of comments, and comments with the post
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
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) throw new AppError("please provide a text of your post", 400);

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
    next(error);
  }
};

exports.getMyFollowingsPosts = async (req, res, next) => {
  try {
    //TODO get number of likes, number of comments, and comments with the post
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
    next(error);
  }
};

exports.editMyPost = async (req, res, next) => {
  try {
    const postId = req.params?.id;
    if (!postId) throw new AppError("provide post id", 400);

    const updatedText = req.body?.text;
    if (!updatedText) throw new AppError("provide the updated post text", 400);

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

    if (!post)
      throw new AppError("this user does not have a post with this id", 404);

    res.status(200).json({
      status: "success",
      message: "edits are applied successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMyPost = async (req, res, next) => {
  try {
    const postId = req.params?.id;
    if (!postId) throw new AppError("provide a post id", 400);

    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        publisher: req.user.id,
      },
      {
        deletedAt: Date.now(),
      },
      { returnDocument: "after" },
    );

    if (!post)
      throw new AppError("this user does not have a post with this id", 404);

    res.status(200).json({
      status: "success",
      message: "post deleted successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params?.id;
    if (!postId) throw new AppError("provide a post id", 400);

    let like = await Like.findOne({ user: userId, post: postId });

    if (like) {
      await Like.findByIdAndDelete(like.id);
    } else {
      like = await Like.create({ user: userId, post: postId });
    }

    res.status(200).json({
      status: "success",
      message: "like toggled successfully",
      like,
    });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const postId = req.params?.id;
    if (!postId) throw new AppError("provide post id", 400);

    const { text } = req.body;
    if (!text) throw new AppError("provide a comment", 400);

    const userId = req.user.id;

    const comment = await Comment.create({
      publisher: userId,
      post: postId,
      text,
    });

    res.status(201).json({
      status: "success",
      message: "comment created successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

exports.editMyComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    if (!postId || !commentId)
      throw new AppError("post id & comment id are required", 400);

    const updatedText = req.body?.text;
    if (!updatedText)
      throw new AppError("provide the updated comment updatedText", 400);

    const userId = req.user.id;

    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        post: postId,
        publisher: userId,
      },
      {
        text: updatedText,
        editedAt: Date.now(),
      },
      {
        returnDocument: "after",
      },
    );

    if (!comment)
      throw new AppError("no comment found. check the entered data", 404);

    res.status(200).json({
      status: "success",
      message: "comment edited successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMyComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    if (!postId || !commentId)
      throw new AppError("post id & comment id are required", 400);

    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        post: postId,
        publisher: req.user.id,
      },
      {
        deletedAt: Date.now(),
      },
      { returnDocument: "after" },
    );

    if (!comment)
      throw new AppError(
        "this user does not have a comment with this id on this post",
        404,
      );

    res.status(200).json({
      status: "success",
      message: "comment deleted successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUserPost = async (req, res, next) => {
  try {
    const postId = req.params?.postId;
    if (!postId) throw new AppError("provide a valid post id", 400);

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        deletedAt: Date.now(),
      },
      {
        returnDocument: "after",
      },
    );

    res.status(200).json({
      status: "success",
      message: "post deleted successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};
