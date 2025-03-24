import express from "express";
import controller from "../../controllers/friend.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/", authMiddleware, controller.index);

export default router;
