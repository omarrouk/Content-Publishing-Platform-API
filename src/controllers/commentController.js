const Comment = require("../models/commentModel");

exports.deleteUserComment = async (req, res) => {
  try {
    const commentId = req.params?.commentId;
    if (!commentId) throw new Error("provide a valid comment id");

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        deletedAt: Date.now(),
      },
      {
        returnDocument: "after",
      },
    );

    if (!comment) throw new Error("no comment found with this id");

    res.status(200).json({
      status: "success",
      message: "comment deleted successfully",
      comment,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "failed to delete user comment",
      error: error.message,
    });
  }
};
