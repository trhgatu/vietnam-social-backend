import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js"
import asyncHandler from "../middlewares/async.js";
import ErrorResponse from "../utils/errorResponse.js";

const controller = {
    index: asyncHandler(async (req, res, next) => {
        const { username } = req.params;

        const user = await User.findOne({username}).populate({
            path: "friends",
            select: "name username avatar bio isOnline lastActive"
        });

        if(!user) {
            return next(new ErrorResponse(`Không tìm thấy user với username: ${username}`, 404));
        }
        res.status(200).json({
            success: true,
            count: user.friends.length,
            data: user.friends
        });
    }),

    getFriendRequests: asyncHandler(async (req, res, next) => {
        const requests = await FriendRequest.find({
            toUser: req.user.id,
            status: "pending"
        }).populate({
            path: "fromUser",
            select: "name username avatar bio"
        });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    }),

    sendFriendRequest: asyncHandler(async (req, res, next) => {
        const { userId } = req.body;

        if(userId === req.user.id) {
            return next(new ErrorResponse("Không thể gửi lời mời kết bạn cho chính mình", 400));
        }

        const receiver = await User.findById(userId);
        if(!receiver) {
            return next(new ErrorResponse(`Không tìm thấy người dùng với id ${userId}`, 404));
        }

        const existingRequest = await FriendRequest.findOne({
            fromUser: req.user.id,
            toUser: userId,
            status: "pending"
        });

        if(existingRequest) {
            return next(new ErrorResponse("Bạn đã gửi lời mời kết bạn trước đó", 400));
        }

        await FriendRequest.create({
            fromUser: req.user.id,
            toUser: userId,
            status: "pending"
        });

        res.status(200).json({ message: "Đã gửi lời mời kết bạn" });
    }),

    acceptFriendRequest: asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        const request = await FriendRequest.findOne({
            _id: id,
            toUser: req.user.id,
            status: "pending"
        });

        if(!request) {
            return next(new ErrorResponse("Lời mời kết bạn không tồn tại hoặc đã xử lý", 404));
        }

        const sender = await User.findById(request.fromUser);
        const receiver = await User.findById(request.toUser);
        if(receiver.friends.includes(sender.id)) {
            return next(new ErrorResponse("Hai bạn đã là bạn bè", 400));
        }
        receiver.friends.push(sender.id);
        sender.friends.push(receiver.id);
        await request.deleteOne();
        await receiver.save();
        await sender.save();

        res.status(200).json({ message: "Đã chấp nhận lời mời kết bạn" });
    }),

    removeFriend: asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        const friend = await User.findById(id);

        if(!friend) {
            return next(new ErrorResponse("Người dùng không tồn tại", 404));
        }
        if(!user.friends.includes(friend.id)) {
            return next(new ErrorResponse("Người này không phải bạn bè của bạn", 400));
        }

        user.friends = user.friends.filter(friendId => friendId.toString() !== friend.id.toString());
        friend.friends = friend.friends.filter(friendId => friendId.toString() !== user.id.toString());

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Đã xóa bạn bè" });
    })
};

export default controller;
