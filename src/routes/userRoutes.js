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

router.post(
  "/signup",
  multer.upload.single("profilePhoto"),
  validate(authSchema.signupSchema),
  authController.signup,
);

router.post("/login", validate(authSchema.loginSchema), authController.login);

router.post("/logout", auth.protect, authController.logout);

router.get(
  "/:id",
  validate({ params: userSchema.userIdSchema }),
  userController.getUserById,
);

router.post(
  "/forgot-password",
  validate(authSchema.forgotPasswordSchema),
  authController.forgotMyPassword,
);

router.post(
  "/reset-password",
  validate(authSchema.resetPasswordSchema),
  authController.resetMyPassword,
);

router.use(auth.protect);

router.patch(
  "/me",
  multer.upload.single("profilePhoto"),
  validate(userSchema.updateProfileSchema),
  userController.updateMyProfile,
);

router.patch(
  "/me/password",
  validate({ body: userSchema.changePasswordSchema }),
  userController.changeMyPassword,
);

router
  .route("/:id/follow")
  .post(validate(followSchema.followUserSchema), userController.followUser)
  .delete(validate(followSchema.followUserSchema), userController.unfollowUser);

router.use(auth.restrictTo("ADMIN"));

router.patch(
  "/update-user-role/:id",
  validate(userSchema.updateUserRoleSchema),
  userController.updateUserRole,
);

router.delete(
  "/delete-user-account/:id",
  validate(userSchema.deleteUserAccountSchema),
  userController.deleteUserAccount,
);

module.exports = router;
