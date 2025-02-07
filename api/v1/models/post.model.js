import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, slug: "title", unique: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        thumbnail: { type: String },
        tags: [{ type: String }],
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        readingTime: { type: String },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "posts");

export default Post;
