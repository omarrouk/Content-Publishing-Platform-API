const { Router } = require("express");
const auth = require("../middlewares/auth");
const commentController = require("../controllers/commentController");
const validate = require("../middlewares/validate");
const commentSchema = require("../schemas/commentSchemas");

const router = Router();

router.delete(
  "/delete-user-comment/:commentId",
  auth.protect,
  auth.restrictTo("ADMIN"),
  validate(commentSchema.deleteUserCommentSchema),
  commentController.deleteUserComment,
);

module.exports = router;
