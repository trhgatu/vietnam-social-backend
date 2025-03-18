import express from "express";
import controller from "../../controllers/friend.controller.js";

const router = express.Router();

router.get("/:username", controller.getFriends);

router.post("/:username/request", controller.sendFriendRequest);

router.post("/:username/accept", controller.acceptFriendRequest);

router.delete("/:username/remove", controller.removeFriend);

export default router;
