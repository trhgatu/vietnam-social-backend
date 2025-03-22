import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
    },
    { timestamps: true }
);

const Friendship = mongoose.model("Friendship", friendshipSchema, "friendships");

export default Friendship;
