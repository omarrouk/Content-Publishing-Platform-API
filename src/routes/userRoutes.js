const { Router } = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authcontroller");
const multerMiddleware = require("../middlewares/multerMiddleware");

const router = Router();

router.post(
  "/signup",
  multerMiddleware.upload.single("profilePhoto"),
  authController.signup,
);
router.post("/login", authController.login);
router.get("/:id", userController.getUserById);

module.exports = router;
