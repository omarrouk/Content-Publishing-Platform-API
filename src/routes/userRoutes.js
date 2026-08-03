const { Router } = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authcontroller");
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const authSchema = require("../schemas/authSchemas");
const userSchema = require("../schemas/userSchemas");
const followSchema = require("../schemas/followSchemas");

const router = Router();

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Str0ngP@ssword!
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: user created successfully
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a111
 *                 username: john_doe
 *                 email: john@example.com
 *                 firstName: John
 *                 lastName: Doe
 *                 profilePhoto: uploads/12344322-2323.jpg
 *                 role: USER
 *                 loggedOutAt: null
 *                 resetPasswordToken: null
 *                 resetPasswordTokenExpiredAt: null
 *                 createdAt: 2026-08-01T10:00:00.000Z
 *                 deletedAt: null
 *                 __v: 0
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             examples:
 *               missingRequiredFields:
 *                 summary: Missing required fields
 *                 value:
 *                   status: fail
 *                   message: Username is required, Email is required, Password is required
 *               invalidFieldLength:
 *                 summary: Field is too short or too long
 *                 value:
 *                   status: fail
 *                   message: Password must be at least 8 characters long
 *               duplicatedCredentials:
 *                 summary: Email or username already exists
 *                 value:
 *                   status: fail
 *                   message: this email is already used by another user
 */
router.post(
  "/signup",
  multer.upload.single("profilePhoto"),
  validate(authSchema.signupSchema),
  authController.signup,
);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Str0ngP@ssword!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: user logged in successfully
 *               user:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a111
 *                 username: john_doe
 *                 email: john@example.com
 *                 firstName: John
 *                 lastName: Doe
 *                 profilePhoto: uploads/12344322-2323.jpg
 *                 role: USER
 *                 loggedOutAt: null
 *                 resetPasswordToken: null
 *                 resetPasswordTokenExpiredAt: null
 *                 createdAt: 2026-08-01T10:00:00.000Z
 *                 deletedAt: null
 *                 __v: 0
 *       400:
 *         description: Missing required field
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Email is required
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: wrong email or password
 */
router.post("/login", validate(authSchema.loginSchema), authController.login);

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logout the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: logged out successfully
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
router.post("/logout", auth.protect, authController.logout);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user profile by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a111
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: user account fitched successfully
 *               user:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a111
 *                 username: john_doe
 *                 firstName: John
 *                 lastName: Doe
 *                 profilePhoto: uploads/12344322-2323.jpg
 *                 role: USER
 *               numOfPosts: 1
 *               posts:
 *                 - _id: 69f0a47ec8aa4d2f6e132b34
 *                   publisher: 69f06ef08eb799c49065425e
 *                   text: this is text 3
 *                   photos: []
 *                   editedAt: null
 *                   deletedAt: null
 *                   createdAt: 2026-04-28T12:13:50.343Z
 *                   __v: 0
 *       400:
 *         description: Invalid user id format
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Provide a valid id
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: no user found with this id
 */
router.get(
  "/:id",
  validate({ params: userSchema.userIdSchema }),
  userController.getUserById,
);

/**
 * @swagger
 * /api/v1/users/forgot-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Request a password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Reset token sent successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: reset token sent successfully
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Email is required
 *       404:
 *         description: No user found with the provided email
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: no user found with this email
 */
router.post(
  "/forgot-password",
  validate(authSchema.forgotPasswordSchema),
  authController.forgotMyPassword,
);

/**
 * @swagger
 * /api/v1/users/reset-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset a password with a token
 *     parameters:
 *       - in: query
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *           example: 27d2b8c0e1f3a4b5c6d7e8f90123456789abcdef0123456789abcdef012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStr0ngP@ssword!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: password resetted successfully
 *       400:
 *         description: Missing or invalid reset data
 *         content:
 *           application/json:
 *             examples:
 *               missingResetToken:
 *                 summary: Reset token is missing
 *                 value:
 *                   status: fail
 *                   message: reset token is required
 *               shortPassword:
 *                 summary: New password is too short
 *                 value:
 *                   status: fail
 *                   message: Password must be at least 8 characters long
 *               invalidResetToken:
 *                 summary: Reset token is invalid
 *                 value:
 *                   status: fail
 *                   message: reset token is invalid
 */
router.post(
  "/reset-password",
  validate(authSchema.resetPasswordSchema),
  authController.resetMyPassword,
);

router.use(auth.protect);

/**
 * @swagger
 * /api/v1/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe_updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *               firstName:
 *                 type: string
 *                 example: Johnny
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: profile updated successfully
 *               user:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a111
 *                 username: john_doe_updated
 *                 email: john.updated@example.com
 *                 firstName: Johnny
 *                 lastName: Doe
 *                 profilePhoto: uploads/12344322-2323.jpg
 *                 role: USER
 *                 loggedOutAt: null
 *                 resetPasswordToken: null
 *                 resetPasswordTokenExpiredAt: null
 *                 createdAt: 2026-08-01T10:00:00.000Z
 *                 deletedAt: null
 *                 __v: 0
 *       400:
 *         description: Validation failed or no fields provided
 *         content:
 *           application/json:
 *             examples:
 *               missingUpdateFields:
 *                 summary: No fields were provided
 *                 value:
 *                   status: fail
 *                   message: Provide at least one field to update
 *               invalidEmail:
 *                 summary: Email is invalid
 *                 value:
 *                   status: fail
 *                   message: Email is not valid
 *               invalidNameLength:
 *                 summary: Name is too short or too long
 *                 value:
 *                   status: fail
 *                   message: First name must be at least 3 characters long
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
 *                   message: invalid signature
 */
router.patch(
  "/me",
  multer.upload.single("profilePhoto"),
  validate(userSchema.updateProfileSchema),
  userController.updateMyProfile,
);

/**
 * @swagger
 * /api/v1/users/me/password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change the authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: Str0ngP@ssword!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStr0ngP@ssword!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: password changed successfully
 *               user:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a111
 *                 username: john_doe
 *                 email: john@example.com
 *                 firstName: John
 *                 lastName: Doe
 *                 profilePhoto: uploads/12344322-2323.jpg
 *                 role: USER
 *                 loggedOutAt: 2026-08-01T10:00:00.000Z
 *                 resetPasswordToken: null
 *                 resetPasswordTokenExpiredAt: null
 *                 createdAt: 2026-08-01T10:00:00.000Z
 *                 deletedAt: null
 *                 __v: 0
 *       400:
 *         description: Invalid password payload
 *         content:
 *           application/json:
 *             examples:
 *               missingCurrentPassword:
 *                 summary: Current password missing
 *                 value:
 *                   status: fail
 *                   message: enter your current password
 *               shortNewPassword:
 *                 summary: New password is too short
 *                 value:
 *                   status: fail
 *                   message: Password must be at least 8 characters long
 *       401:
 *         description: Authentication failed or current password is wrong
 *         content:
 *           application/json:
 *             examples:
 *               authProtectError:
 *                 summary: Missing or invalid auth token
 *                 value:
 *                   status: fail
 *                   message: missed token. please login
 *               wrongCurrentPassword:
 *                 summary: Current password is wrong
 *                 value:
 *                   status: fail
 *                   message: current password is wrong
 */
router.patch(
  "/me/password",
  validate({ body: userSchema.changePasswordSchema }),
  userController.changeMyPassword,
);

/**
 * @swagger
 * /api/v1/users/{id}/follow:
 *   post:
 *     tags:
 *       - Users
 *     summary: Follow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a222
 *     responses:
 *       201:
 *         description: Follow created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: follow created successfully
 *               follow:
 *                 follower: 66a1f0d8a2c6d5d8f1e9a111
 *                 following: 66a1f0d8a2c6d5d8f1e9a222
 *       400:
 *         description: Invalid follow request
 *         content:
 *           application/json:
 *             examples:
 *               invalidFollowerId:
 *                 summary: Invalid user id
 *                 value:
 *                   status: fail
 *                   message: Provide a valid id
 *               followYourself:
 *                 summary: Self follow is rejected
 *                 value:
 *                   status: fail
 *                   message: can`t follow yourself
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
 *       - Users
 *     summary: Unfollow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a222
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: unfollowed successfully
 *               follow:
 *                 follower: 66a1f0d8a2c6d5d8f1e9a111
 *                 following: 66a1f0d8a2c6d5d8f1e9a222
 *       400:
 *         description: Invalid unfollow request
 *         content:
 *           application/json:
 *             examples:
 *               invalidFollowerId:
 *                 summary: Invalid user id
 *                 value:
 *                   status: fail
 *                   message: Provide a valid id
 *               unfollowYourself:
 *                 summary: Self unfollow is rejected
 *                 value:
 *                   status: fail
 *                   message: can`t unfollow yourself
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
  .route("/:id/follow")
  .post(validate(followSchema.followUserSchema), userController.followUser)
  .delete(validate(followSchema.followUserSchema), userController.unfollowUser);

router.use(auth.restrictTo("ADMIN"));

/**
 * @swagger
 * /api/v1/users/update-user-role/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user's role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a111
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newRole
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: user role updated successfully
 *               user:
 *                 _id: 66a1f0d8a2c6d5d8f1e9a111
 *                 username: john_doe
 *                 email: john@example.com
 *                 firstName: John
 *                 lastName: Doe
 *                 profilePhoto: uploads/12344322-2323.jpg
 *                 role: ADMIN
 *                 loggedOutAt: null
 *                 resetPasswordToken: null
 *                 resetPasswordTokenExpiredAt: null
 *                 createdAt: 2026-08-01T10:00:00.000Z
 *                 deletedAt: null
 *                 __v: 0
 *       400:
 *         description: Invalid role or missing user id
 *         content:
 *           application/json:
 *             examples:
 *               invalidUserId:
 *                 summary: User id is invalid
 *                 value:
 *                   status: fail
 *                   message: Provide a valid id
 *               invalidRole:
 *                 summary: Role is invalid
 *                 value:
 *                   status: fail
 *                   message: provide a valid user role
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
 *       403:
 *         description: Not allowed function
 *         content:
 *           application/json:
 *             examples:
 *               wrongRole:
 *                 summary: This user role is not allowed to do this function
 *                 value:
 *                   status: fail
 *                   message: not allowed to complete this function
 */
router.patch(
  "/update-user-role/:id",
  validate(userSchema.updateUserRoleSchema),
  userController.updateUserRole,
);

/**
 * @swagger
 * /api/v1/users/delete-user-account/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66a1f0d8a2c6d5d8f1e9a111
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: user deleted successfully
 *       400:
 *         description: Invalid user id
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Provide a valid id
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
  "/delete-user-account/:id",
  validate(userSchema.deleteUserAccountSchema),
  userController.deleteUserAccount,
);

module.exports = router;
