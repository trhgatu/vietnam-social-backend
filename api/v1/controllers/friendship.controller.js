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
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingRequest) {
            return next(new ErrorResponse("Bạn đã gửi lời mời trước đó hoặc đã là bạn bè!", 400));
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
