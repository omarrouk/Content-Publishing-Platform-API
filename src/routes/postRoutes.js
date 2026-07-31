const { Router } = require("express");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const postController = require("../controllers/postController");
const validate = require("../middlewares/validate");
const postSchema = require("../schemas/postSchemas");
const likeSchema = require("../schemas/likeSchemas");
const commentSchema = require("../schemas/commentSchemas");

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
  .post(validate(likeSchema.toggleLikeSchema), postController.toggleLike);
router
  .route("/:id/comments")
  .post(validate(commentSchema.addCommentSchema), postController.addComment);

router
  .route("/:postId/comments/:commentId")
  .patch(
    validate(commentSchema.editCommentSchema),
    postController.editMyComment,
  )
  .delete(
    validate(commentSchema.deleteCommentSchema),
    postController.deleteMyComment,
  );

module.exports = router;
