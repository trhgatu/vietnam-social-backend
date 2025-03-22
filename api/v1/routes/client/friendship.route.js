import express from "express";
import controller from "../../controllers/friendship.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/send", authMiddleware, controller.sendFriendRequest);

router.post("/accept", authMiddleware, controller.acceptFriendRequest);

router.post("/reject", authMiddleware, controller.rejectOrRemoveFriend);

router.get("/", authMiddleware, controller.index);

router.get("/received-requests", authMiddleware, controller.getReceivedFriendRequests);

router.get("/sent-requests", authMiddleware, controller.getSentFriendRequests);

export default router;
