import express from "express";
import controller from "../../controllers/user.controller.js";

const router = express.Router();

router.get("/:username", controller.getUserByUsername);
router.post("/createUsers", controller.createUsers);
export default router;
