import User from "../models/user.model.js";

const controller = {
    getFriends: async (req, res) => {
        try {
            const { username } = req.params;
            const user = await User.findOne({ username }).populate("friends");
            if(!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            res.status(200).json({ friends: user.friends });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách bạn bè", error });
        }
    },

    sendFriendRequest: async (req, res) => {
        try {
            const { username } = req.params;
            const sender = req.user;

            const receiver = await User.findOne({ username });

            if(!receiver) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            if(receiver.friendRequests.includes(sender.id)) {
                return res.status(400).json({ message: "Đã gửi lời mời kết bạn trước đó" });
            }

            receiver.friendRequests.push(sender.id);
            await receiver.save();

            res.status(200).json({ message: "Đã gửi lời mời kết bạn" });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi gửi lời mời kết bạn", error });
        }
    },

    acceptFriendRequest: async (req, res) => {
        try {
            const { username } = req.params;
            const user = req.user;

            const sender = await User.findOne({ username });

            if(!sender) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            if(!user.friendRequests.includes(sender.id)) {
                return res.status(400).json({ message: "Không có lời mời từ người này" });
            }

            // Thêm bạn bè cho cả hai
            user.friends.push(sender.id);
            sender.friends.push(user.id);

            // Xóa lời mời
            user.friendRequests = user.friendRequests.filter(id => id !== sender.id);

            await user.save();
            await sender.save();

            res.status(200).json({ message: "Đã chấp nhận lời mời kết bạn" });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi chấp nhận lời mời kết bạn", error });
        }
    },

    removeFriend: async (req, res) => {
        try {
            const { username } = req.params;
            const user = req.user;

            const friend = await User.findOne({ username });

            if(!friend) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            user.friends = user.friends.filter(id => id !== friend.id);
            friend.friends = friend.friends.filter(id => id !== user.id);

            await user.save();
            await friend.save();

            res.status(200).json({ message: "Đã xóa bạn bè" });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa bạn bè", error });
        }
    },
};

export default controller;
