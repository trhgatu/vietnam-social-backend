import Friendship from "../models/friendship.model.js";

export const getFriendIds = async (userId) => {
    try {
        const friendships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted"
        }).select("requester recipient");

        return friendships.flatMap(f =>
            f.requester.toString() === userId ? f.recipient.toString() : f.requester.toString()
        );
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
        return [];
    }
};
