const { Router } = require("express");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const postController = require("../controllers/postController");
const validate = require("../middlewares/validate");
const postSchema = require("../schemas/postSchemas");

const router = Router();

router.get(
  "/",
  validate({ query: postSchema.getPostsQuerySchema }),
  postController.getRandomUsersPosts,
);

router.use(auth.protect);

router.post(
  "/",
  multer.upload.array("photos"),
  validate(postSchema.createPostSchema),
  postController.createPost,
);

router.get(
  "/followings-posts",
  validate({ query: postSchema.getPostsQuerySchema }),
  postController.getMyFollowingsPosts,
);

router.delete(
  "/delete-user-post/:postId",
  auth.restrictTo("ADMIN"),
  validate(postSchema.deleteUserPostSchema),
  postController.deleteUserPost,
);

router
  .route("/:id")
  .patch(validate(postSchema.editPostSchema), postController.editMyPost)
  .delete(validate(postSchema.deletePostSchema), postController.deleteMyPost);

router
  .route("/:id/toggle-like")
  .post(validate(postSchema.toggleLikeSchema), postController.toggleLike);
router
  .route("/:id/comments")
  .post(validate(postSchema.addCommentSchema), postController.addComment);

router
  .route("/:postId/comments/:commentId")
  .patch(validate(postSchema.editCommentSchema), postController.editMyComment)
  .delete(
    validate(postSchema.deleteCommentSchema),
    postController.deleteMyComment,
  );

module.exports = router;
