const express = require("express");

const router = express.Router();
const userController = require("../contollers/userController");
const userMIddleware = require("../middleware/userMiddleware");

router.post("/signup", userController.userRegistration);
router.get("/verify", userController.userVerification);
router.post("/login", userController.userLogin);
router.get("/logout", userController.userLogout);
router.get("/check", userMIddleware.protectRoute, userController.checkAuth);
router.put(
  "/update-profile",
  userMIddleware.protectRoute,
  userController.updateProfile
);
module.exports = router;
