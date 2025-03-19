import express from "express";
import controller from "../../controllers/user.controller.js";

const router = express.Router();

router.get("/:username", controller.getUserByUsername);
router.post("/createUsers", controller.createUsers);
router.post("/:userId/favorite-song",controller.updateFavoriteSong);
router.get("/:userId/favorite-song", controller.getFavoriteSong);
export default router;
