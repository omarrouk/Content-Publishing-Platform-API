const { Router } = require("express");
const authMiddleWare = require("../middlewares/authMiddleware");
const multerMiddleware = require("../middlewares/multerMiddleware");
const postController = require("../controllers/postController");

const router = Router();

router.get("/", postController.getRandomUsersPosts);

router.use(authMiddleWare.protect);

router.post(
  "/",
  multerMiddleware.upload.array("photos"),
  postController.createPost,
);

router.get("/followings-posts", postController.getMyFollowingsPosts);

router.delete(
  "/delete-user-post/:postId",
  authMiddleWare.restrictTo("ADMIN"),
  postController.deleteUserPost,
);

router
  .route("/:id")
  .patch(postController.editMyPost)
  .delete(postController.deleteMyPost);

router.route("/:id/toggle-like").post(postController.toggleLike);
router.route("/:id/comments").post(postController.addComment);

router
  .route("/:postId/comments/:commentId")
  .patch(postController.editMyComment)
  .delete(postController.deleteMyComment);

module.exports = router;
