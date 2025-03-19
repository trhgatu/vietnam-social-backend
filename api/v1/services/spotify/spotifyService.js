import axios from "axios";
import { getAccessToken } from "./spotifyAuth.js";

const SPOTIFY_API_URL = process.env.SPOTIFY_API_URL;

export const getUserPlaylists = async (userId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API_URL}/users/${userId}/playlists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
};

export const getTrackInfo = async (trackId) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API_URL}/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
};

export const searchTracks = async (query) => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { q: query, type: "track", limit: 10 },
    });
    return response.data.tracks.items || [];
};

