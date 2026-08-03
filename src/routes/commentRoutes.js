const { Router } = require("express");
const auth = require("../middlewares/auth");
const commentController = require("../controllers/commentController");
const validate = require("../middlewares/validate");
const commentSchema = require("../schemas/commentSchemas");

const router = Router();

/**
 * @swagger
 * /api/v1/comments/delete-user-comment/{commentId}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete any comment as an admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a888
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: comment deleted successfully
 *       400:
 *         description: Missing comment id
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: provide a valid comment id
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: no comment found with this id
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
  "/delete-user-comment/:commentId",
  auth.protect,
  auth.restrictTo("ADMIN"),
  validate(commentSchema.deleteUserCommentSchema),
  commentController.deleteUserComment,
);

module.exports = router;
