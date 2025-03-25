import express from "express";
import * as messageController from "../controllers/messageController.js";
import * as userMIddleware from "../middleware/userMiddleware.js";

const router = express.Router();
router.get("/users", userMIddleware.protectRoute, messageController.getUsers);
router.get("/:id", userMIddleware.protectRoute, messageController.getMessages);
router.post(
  "/send/:id",
  userMIddleware.protectRoute,
  messageController.sendMessage
);

export default router;
