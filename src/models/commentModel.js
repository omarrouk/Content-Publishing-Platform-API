const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Provide text to your comment"],
    trim: true,
    minlenght: [1, "Comment must contain one or more characters"],
    maxlength: [1000, "Comment must be less than 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

commentSchema.pre(/^find/, function () {
  try {
    if (!this.getOptions().withDeleted) {
      this.where({ deletedAt: { $eq: null } });
    }
  } catch (error) {
    throw error;
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
