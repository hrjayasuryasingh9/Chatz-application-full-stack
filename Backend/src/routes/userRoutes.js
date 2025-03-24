import express from "express";
import * as userController from "../controllers/userController.js";
import * as userMIddleware from "../middleware/userMiddleware.js";

const router = express.Router();
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
export default router;
