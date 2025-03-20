import express from "express";
import controller from "../../controllers/friend.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/:username", authMiddleware, controller.index);

router.get("/requests", controller.getFriendRequests);

router.post("/request", controller.sendFriendRequest);

router.put("/request/:id/accept", controller.acceptFriendRequest);

router.delete("/:id", controller.removeFriend);

export default router;
