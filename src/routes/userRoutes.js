const { Router } = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authcontroller");
const multerMiddleware = require("../middlewares/multerMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.post(
  "/signup",
  multerMiddleware.upload.single("profilePhoto"),
  authController.signup,
);

router.post("/login", authController.login);

router.post("/logout", authMiddleware.protect, authController.logout);

router.get("/:id", userController.getUserById);

router.post("/forgot-password", authController.forgotMyPassword);

router.post("/reset-password", authController.resetMyPassword);

router.use(authMiddleware.protect);

router.patch(
  "/me",
  multerMiddleware.upload.single("profilePhoto"),
  userController.updateMyProfile,
);

router.patch("/me/password", userController.changeMyPassword);

router
  .route("/:id/follow")
  .post(userController.followUser)
  .delete(userController.unfollowUser);

router.use(authMiddleware.restrictTo("ADMIN"));

router.patch("/update-user-role/:id", userController.updateUserRole);

router.delete("/delete-user-account/:id", userController.deleteUserAccount);

module.exports = router;
