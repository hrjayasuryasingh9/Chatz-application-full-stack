const express = require("express");

const router = express.Router();
const messageController = require("../contollers/messageController");
const userMIddleware = require("../middleware/userMiddleware");

router.get("/users", userMIddleware.protectRoute, messageController.getUsers);
router.get("/:id", userMIddleware.protectRoute, messageController.getMessages);
router.post(
  "/send/:id",
  userMIddleware.protectRoute,
  messageController.sendMessage
);

module.exports = router;
