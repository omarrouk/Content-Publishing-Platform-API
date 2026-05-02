const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const commentController = require("../controllers/commentController");

const router = Router();

router.delete(
  "/delete-user-comment/:commentId",
  authMiddleware.protect,
  authMiddleware.restrictTo("ADMIN"),
  commentController.deleteUserComment,
);

module.exports = router;
