import User from "../models/user.model.js";
import Friendship from "../models/friendship.model.js";
import asyncHandler from "../middlewares/async.js";
import ErrorResponse from "../utils/errorResponse.js";

const controller = {
    index: asyncHandler(async (req, res, next) => {
        let user;
        if(req.query.username) {
            user = await User.findOne({ username: req.query.username });

            if(!user) {
                return next(new ErrorResponse(`Không tìm thấy user với username: ${req.query.username}`, 404));
            }
        } else {
            user = req.user;
        }
        const friendships = await Friendship.find({
            $or: [{ requester: user.id }, { recipient: user.id }],
            status: "accepted"
        }).select("requester recipient");
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
}
export default controller;
