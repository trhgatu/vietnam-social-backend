import User from "../models/user.model.js";
import { getTrackInfo } from "../services/spotify/spotifyService.js";
const controller = {
    /* [GET] api/v1/users/:username */
    getUserByUsername: async (req, res) => {
        try {
            const { username } = req.params;
            const user = await User.findOne({ username }).select("-password");

            if(!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            res.status(200).json(user);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy thông tin user", error });
        }
    },
    /* [POST] api/v1/users/bulk-create */
    createUsers: async (req, res) => {
        try {
            const users = req.body;
            users.map(user => ({
                ...user,
            }));
            const createdUsers = await User.insertMany(users);

            res.status(201).json({ message: "Tạo users thành công", users: createdUsers });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi tạo users", error });
        }
    },
    updateFavoriteSong: async (req, res) => {
        try {
            const { userId } = req.params;
            const { trackId } = req.body;

            const track = await getTrackInfo(trackId);
            if(!track) {
                return res.status(404).json({ message: "Track not found" });
            }
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    favoriteSong: {
                        trackId,
                        title: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        imageUrl: track.album.images[0].url,
                        spotifyUrl: track.external_urls.spotify,
                    },
                },
                { new: true }
            );

            res.json(updatedUser);
        } catch(error) {
            res.status(500).json({ message: "Error updating favorite song", error });
        }
    },
    getFavoriteSong: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId).select("favoriteSong");

            if(!user || !user.favoriteSong) {
                return res.status(404).json({ message: "No favorite song found" });
            }

            res.json(user.favoriteSong);
        } catch(error) {
            res.status(500).json({ message: "Error fetching favorite song" });
        }
    }
};

export default controller;
