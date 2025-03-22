import { mongoose } from "../../../config/database.js";

const postSchema = new mongoose.Schema(
    {
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        media: [
            {
                type: String
            }
        ],
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        reactions: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Reaction"
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Comment"
            }
        ],
        shares: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "User"
            }
        ],
        status: {
            type: String,
            enum: [
                "public", "friends", "private"
            ],
            default: "public"
        },
        location: {
            type: String
        },
        feeling: {
            type: String
        },
        isDel: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "posts");

export default Post;
