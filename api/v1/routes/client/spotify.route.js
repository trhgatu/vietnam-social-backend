import express from "express";
import { fetchPlaylists, fetchTrack, searchTrackHandler } from "../../controllers/spotify.controller.js";

const router = express.Router();

router.get("/playlists/:userId", fetchPlaylists);
router.get("/track/:trackId", fetchTrack);
router.get("/search", searchTrackHandler)
export default router;
