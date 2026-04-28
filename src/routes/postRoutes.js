const { Router } = require("express");
const authMiddleWare = require("../middlewares/authMiddleware");
const multerMiddleware = require("../middlewares/multerMiddleware");
const postController = require("../controllers/postController");

const router = Router();

router
  .route("/")
  .get(postController.getRandomUsersPosts)
  .post(
    authMiddleWare.protect,
    multerMiddleware.upload.array("photos"),
    postController.createPost,
  );

router.get(
  "/followings-posts",
  authMiddleWare.protect,
  postController.getMyFollowingsPosts,
);

router
  .route("/:id")
  .all(authMiddleWare.protect)
  .patch(postController.editMyPost)
  .delete(postController.deleteMyPost);

module.exports = router;
