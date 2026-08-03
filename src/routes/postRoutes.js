const { Router } = require("express");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const postController = require("../controllers/postController");
const validate = require("../middlewares/validate");
const postSchema = require("../schemas/postSchemas");
const likeSchema = require("../schemas/likeSchemas");
const commentSchema = require("../schemas/commentSchemas");

const router = Router();

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get posts from random users
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: newestFirst
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: posts fetched successfully
 *               length: 1
 *               posts:
 *                 - _id: 66a1f0d8a2c6d5d8f1e9a333
 *                   publisher:
 *                     _id: 66a1f0d8a2c6d5d8f1e9a111
 *                     username: johndoe
 *                     email: john@example.com
 *                     firstName: John
 *                     lastName: Doe
 *                   text: Hello world
 *                   photos:
 *                     - uploads/photo1.jpg
 *                   createdAt: 2026-08-01T10:00:00.000Z
 *                   editedAt: null
 *                   deletedAt: null
 *       400:
 *         description: Invalid pagination query
 *         content:
 *           application/json:
 *             examples:
 *               invalidPage:
 *                 summary: Page is invalid
 *                 value:
 *                   status: fail
 *                   message: Page must be a number
 *               invalidLimit:
 *                 summary: Limit is invalid
 *                 value:
 *                   status: fail
 *                   message: Limit must be a number
 */
router.get(
  "/",
  validate({ query: postSchema.getPostsQuerySchema }),
  postController.getRandomUsersPosts,
);

router.use(auth.protect);

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: This is my first post in the platform.
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: post created successfully
 *               post:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a333
 *                 publisher:
 *                   _id: 66a1f0d8a2c6d5d8f1e9a111
 *                   username: johndoe
 *                   email: john@example.com
 *                   firstName: John
 *                   lastName: Doe
 *                 text: Hello world
 *                 photos:
 *                   - uploads/photo1.jpg
 *                 createdAt: 2026-08-01T10:00:00.000Z
 *                 editedAt: null
 *                 deletedAt: null
 *       400:
 *         description: Missing or invalid post text
 *         content:
 *           application/json:
 *             examples:
 *               missingText:
 *                 summary: Text is missing
 *                 value:
 *                   status: fail
 *                   message: Post text is required
 *               tooShortText:
 *                 summary: Text is too short
 *                 value:
 *                   status: fail
 *                   message: Post text must be at least 1 characters long
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 */
router.post(
  "/",
  multer.upload.array("photos"),
  validate(postSchema.createPostSchema),
  postController.createPost,
);

/**
 * @swagger
 * /api/v1/posts/followings-posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get posts from followed users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: newestFirst
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Followings posts fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: followings posts fetched successfully
 *               posts:
 *                 - _id: 66a1f0d8a2c6d5d8f1e9a333
 *                   publisher:
 *                     _id: 66a1f0d8a2c6d5d8f1e9a111
 *                     username: johndoe
 *                     email: john@example.com
 *                     firstName: John
 *                     lastName: Doe
 *                   text: Hello world
 *                   photos:
 *                     - uploads/photo1.jpg
 *                   createdAt: 2026-08-01T10:00:00.000Z
 *                   editedAt: null
 *                   deletedAt: null
 *       400:
 *         description: Invalid pagination query
 *         content:
 *           application/json:
 *             examples:
 *               invalidPage:
 *                 summary: Page is invalid
 *                 value:
 *                   status: fail
 *                   message: Page must be a number
 *               invalidLimit:
 *                 summary: Limit is invalid
 *                 value:
 *                   status: fail
 *                   message: Limit must be a number
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 */
router.get(
  "/followings-posts",
  validate({ query: postSchema.getPostsQuerySchema }),
  postController.getMyFollowingsPosts,
);

/**
 * @swagger
 * /api/v1/posts/delete-user-post/{postId}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete any user's post as an admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a666
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: post deleted successfully
 *       400:
 *         description: Missing post id
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: provide a valid post id
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: no post found with this id
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 */
router.delete(
  "/delete-user-post/:postId",
  auth.restrictTo("ADMIN"),
  validate(postSchema.deleteUserPostSchema),
  postController.deleteUserPost,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   patch:
 *     tags:
 *       - Posts
 *     summary: Update the authenticated user's post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a444
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: Updated text for my post.
 *     responses:
 *       200:
 *         description: Post edited successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: edits are applied successfully
 *               post:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a333
 *                 publisher:
 *                   _id: 66a1f0d8a2c6d5d8f1e9a111
 *                   username: johndoe
 *                   email: john@example.com
 *                   firstName: John
 *                   lastName: Doe
 *                 text: Hello world
 *                 photos:
 *                   - uploads/photo1.jpg
 *                 createdAt: 2026-08-01T10:00:00.000Z
 *                 editedAt: null
 *                 deletedAt: null
 *       400:
 *         description: Missing or invalid post text
 *         content:
 *           application/json:
 *             examples:
 *               missingText:
 *                 summary: Text is missing
 *                 value:
 *                   status: fail
 *                   message: provide the updated post text
 *               tooShortText:
 *                 summary: Text is too short
 *                 value:
 *                   status: fail
 *                   message: Post text must be at least 1 characters long
 *       404:
 *         description: Post not found for the authenticated user
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: this user does not have a post with this id
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete the authenticated user's post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a444
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: post deleted successfully
 *       400:
 *         description: Missing post id
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: provide a post id
 *       404:
 *         description: Post not found for the authenticated user
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: this user does not have a post with this id
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 */
router
  .route("/:id")
  .patch(validate(postSchema.editPostSchema), postController.editMyPost)
  .delete(validate(postSchema.deletePostSchema), postController.deleteMyPost);

/**
 * @swagger
 * /api/v1/posts/{id}/toggle-like:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Toggle like on a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a444
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: like toggled successfully
 *       400:
 *         description: Missing post id
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: provide a post id
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: no post found with this id
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 */
router
  .route("/:id/toggle-like")
  .post(validate(likeSchema.toggleLikeSchema), postController.toggleLike);

/**
 * @swagger
 * /api/v1/posts/{id}/comments:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Add a comment to a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a444
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: Nice post, thanks for sharing.
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: comment created successfully
 *               comment:
 *                 publisher: 69f06ef08eb799c49065425e
 *                 post: 69f0a47ec8aa4d2f6e132b34
 *                 text: this is comment on post 3
 *                 editedAt: null
 *                 deletedAt: null
 *                 _id: 6a707ba083df9d11dadbc861
 *                 createdAt: 2026-08-03T11:29:36.592Z
 *                 __v: 0
 *       400:
 *         description: Missing or invalid comment text
 *         content:
 *           application/json:
 *             examples:
 *               missingText:
 *                 summary: Text is missing
 *                 value:
 *                   status: fail
 *                   message: Comment text is required
 *               tooLongText:
 *                 summary: Text is too long
 *                 value:
 *                   status: fail
 *                   message: Comment text must not exceed 1000 characters
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 */
router
  .route("/:id/comments")
  .post(validate(commentSchema.addCommentSchema), postController.addComment);

/**
 * @swagger
 * /api/v1/posts/{postId}/comments/{commentId}:
 *   patch:
 *     tags:
 *       - Posts
 *     summary: Edit one of the authenticated user's comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a444
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a777
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: Updated comment text.
 *     responses:
 *       200:
 *         description: Comment edited successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: comment edited successfully
 *               comment:
 *                 publisher: 69f06ef08eb799c49065425e
 *                 post: 69f0a47ec8aa4d2f6e132b34
 *                 text: Updated comment text
 *                 editedAt: 2026-08-03T12:00:00.000Z
 *                 deletedAt: null
 *                 _id: 6a707ba083df9d11dadbc861
 *                 createdAt: 2026-08-03T11:29:36.592Z
 *                 __v: 0
 *       400:
 *         description: Missing required ids or text
 *         content:
 *           application/json:
 *             examples:
 *               missingIds:
 *                 summary: Required ids are missing
 *                 value:
 *                   status: fail
 *                   message: post id & comment id are required
 *               missingText:
 *                 summary: Text is missing
 *                 value:
 *                   status: fail
 *                   message: provide the updated comment updatedText
 *       404:
 *         description: Comment not found or not owned by user
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: no comment found. check the entered data
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete one of the authenticated user's comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a444
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a777
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: comment deleted successfully
 *       400:
 *         description: Missing required ids
 *         content:
 *           application/json:
 *             examples:
 *               missingIds:
 *                 summary: Required ids are missing
 *                 value:
 *                   status: fail
 *                   message: post id & comment id are required
 *       404:
 *         description: Comment not found or not owned by user
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: this user does not have a comment with this id on this post
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Bearer token is missing
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               invalidToken:
 *                 summary: Bearer token is invalid
 *                 value:
 *                   status: fail
 *                   message: jwt malformed
 */
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
