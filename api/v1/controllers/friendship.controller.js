import User from "../models/user.model.js";
import Friendship from "../models/friendship.model.js";
import asyncHandler from "../middlewares/async.js";
import ErrorResponse from "../utils/errorResponse.js";

const controller = {
    sendFriendRequest: asyncHandler(async (req, res, next) => {
        const { recipientId } = req.body;
        const requesterId = req.user.id;

        if (requesterId === recipientId) {
            return next(new ErrorResponse("Không thể gửi lời mời kết bạn cho chính mình!", 400));
        }
        const existingRequest = await Friendship.findOne({
            requester: requesterId,
            recipient: recipientId,
        });

        if (existingRequest) {
            return next(new ErrorResponse("Bạn đã gửi lời mời trước đó!", 400));
        }
        const newRequest = new Friendship({
            requester: requesterId,
            recipient: recipientId,
            status: "pending",
        });

        await newRequest.save();

        res.status(201).json({ success: true, message: "Lời mời kết bạn đã được gửi!" });
    }),
    acceptFriendRequest: asyncHandler(async (req, res, next) => {
        const { requestId } = req.body;

        const friendship = await Friendship.findById(requestId);

        if (!friendship || friendship.status !== "pending") {
            return next(new ErrorResponse("Lời mời không hợp lệ hoặc đã xử lý!", 400));
        }
        friendship.status = "accepted";
        await friendship.save();

        res.status(200).json({ success: true, message: "Bạn đã chấp nhận lời mời kết bạn!" });
    }),
    rejectOrRemoveFriend: asyncHandler(async (req, res, next) => {
        const { requestId } = req.body;

        const friendship = await Friendship.findById(requestId);
        if (!friendship) {
            return next(new ErrorResponse("Lời mời kết bạn không tồn tại!", 404));
        }

        await Friendship.findByIdAndDelete(requestId);

        res.status(200).json({ success: true, message: "Lời mời đã bị từ chối hoặc bạn đã hủy kết bạn!" });
    }),
    index: asyncHandler(async (req, res, next) => {
        let user;

        // Kiểm tra xem có query `username` hay không
        if (req.query.username) {
            user = await User.findOne({ username: req.query.username });

            if (!user) {
                return next(new ErrorResponse(`Không tìm thấy user với username: ${req.query.username}`, 404));
            }
        } else {
            // Nếu không có username thì lấy user đang đăng nhập
            user = req.user;
        }

        // Lấy danh sách bạn bè từ bảng Friendship
        const friendships = await Friendship.find({
            $or: [{ requester: user.id }, { recipient: user.id }],
            status: "accepted"
        }).select("requester recipient");

        // Lọc ra danh sách bạn bè (tránh user tự nhận bạn với chính mình)
        const friendIds = friendships.map(f =>
            f.requester.toString() === user.id ? f.recipient.toString() : f.requester.toString()
        );

        const friends = await User.find({ _id: { $in: friendIds } })
            .select("name username avatar isOnline lastActive");

        res.status(200).json({
            success: true,
            count: friends.length,
            data: friends
        });
    }),
    getReceivedFriendRequests: asyncHandler(async (req, res, next) => {
        const userId = req.user.id;

        const requests = await Friendship.find({
            recipient: userId,
            status: "pending",
        }).populate("requester", "name username avatar");

        res.status(200).json({ success: true, data: requests });
    }),
    getSentFriendRequests: asyncHandler(async (req, res, next) => {
        const userId = req.user.id;

        const requests = await Friendship.find({
            requester: userId,
            status: "pending",
        }).populate("recipient", "name username avatar");

        res.status(200).json({ success: true, data: requests });
    }),
};

export default controller;
