const Comment = require("../models/commentModel");
const AppError = require("../utils/AppError");

exports.deleteUserComment = async (req, res, next) => {
  try {
    const commentId = req.params?.commentId;
    if (!commentId) throw new AppError("provide a valid comment id", 400);

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        deletedAt: Date.now(),
      },
      {
        returnDocument: "after",
      },
    );

    if (!comment) throw new AppError("no comment found with this id", 404);

    res.status(200).json({
      status: "success",
      message: "comment deleted successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};
