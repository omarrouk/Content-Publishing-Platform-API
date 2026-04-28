const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true,
    minlength: [1, "Post must contain one or more characters"],
    required: [true, "Provide text to your post"],
  },
  photos: {
    type: [
      {
        type: String,
      },
    ],
    default: null,
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

postSchema.pre(/^find/, function (next) {
  try {
    if (!this.getOptions().withDeleted) {
      this.where({ deletedAt: { $eq: null } });
    }
    next();
  } catch (error) {
    throw error;
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
