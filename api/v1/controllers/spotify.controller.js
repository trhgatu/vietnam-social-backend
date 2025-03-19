import { getUserPlaylists, getTrackInfo, searchTracks } from "../services/spotify/spotifyService.js";

export const fetchPlaylists = async (req, res) => {
    try {
        const { userId } = req.params;
        const playlists = await getUserPlaylists(userId);
        res.json(playlists);
    } catch(error) {
        res.status(500).json({ message: "Error fetching playlists" });
    }
};

export const fetchTrack = async (req, res) => {
    try {
        const { trackId } = req.params;
        const track = await getTrackInfo(trackId);
        res.json(track);
    } catch(error) {
        res.status(500).json({ message: "Error fetching track" });
    }
};
export const searchTrackHandler = async (req, res) => {
    try {
        const { query } = req.query;
        if(!query) return res.status(400).json({ message: "Query parameter is required" });

        const tracks = await searchTracks(query);
        res.json({ tracks });

    } catch(error) {
        console.error("Error searching tracks:", error.message);
        res.status(500).json({ message: "Error searching tracks" });
    }
};

