import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Reaction from "../models/reaction.model.js";
import Comment from "../models/comment.model.js";
import paginate from "../helpers/paginate.js";
import { getFriendIds } from "../utils/friends.js";

const controller = {
    /* [GET] api/v1/posts */
    index: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const userId = req.user?.id;
            let query = { isDel: false };

            if(userId) {
                const friendIds = await getFriendIds(userId);
                query.$or = [
                    { status: "public" },
                    { status: "friends", authorId: { $in: friendIds } },
                    { authorId: userId }
                ];
            } else {
                query.status = "public";
            }

            const result = await paginate(Post, query, page, limit, [
                { path: "authorId", select: "name avatar" },
                { path: "reactions", select: "userId type" },
                { path: "comments", select: "_id" }
            ]);

            res.status(200).json(result);
        } catch(error) {
            console.error("Lỗi khi lấy danh sách bài viết:", error);
            res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error });
        }
    },
    getPostsByUsername: async (req, res) => {
        const { username } = req.params;

        try {
            const user = await User.findOne({ username });
            if(!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const posts = await Post.find({ authorId: user._id })
                .populate('authorId', 'name username avatar')

            if(!posts.length) {
                return res.status(404).json({ message: 'No posts found for this user' });
            }

            res.json({ data: posts });
        } catch(error) {
            res.status(500).json({ message: 'Error fetching user posts', error });
        }
    },
    /* [GET] api/v1/posts/:id */
    show: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await Post.findById(id).populate("authorId", "name avatar");

            if(!post || post.isDel) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }

            res.status(200).json(post);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy bài viết", error });
        }
    },

    /* [POST] api/v1/posts/create */
    create: async (req, res) => {
        try {
            const { content, media, tags, status, location, feeling } = req.body;

            if(!req.user || !req.user.id) {
                return res.status(401).json({ message: "Không có quyền thực hiện hành động này." });
            }

            const newPost = new Post({
                authorId: req.user.id,
                content,
                media: media || [],
                tags: tags || [],
                status: status || "public",
                location,
                feeling
            });

            const savedPost = await newPost.save();
            res.status(201).json({ success: true, message: "Đăng bài viết thành công", savedPost });
        } catch(error) {
            console.error("Lỗi khi tạo bài viết:", error);
            res.status(500).json({ message: "Lỗi khi tạo bài viết", error: error.message });
        }
    },

    /* [PUT] api/v1/posts/:id */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });

            if(!updatedPost) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }

            res.status(200).json({ message: "Cập nhật bài viết thành công", updatedPost });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi cập nhật bài viết", error });
        }
    },

    /* [DELETE] api/v1/posts/:id */
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const post = await Post.findByIdAndUpdate(id, { isDel: true }, { new: true });
            if(!post) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }
            res.status(200).json({ message: "Xóa bài viết thành công", post });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa bài viết", error });
        }
    },

    /* [POST] api/v1/posts/:id/reactions */
    toggleReaction: async (req, res) => {
        try {
            const { id } = req.params;
            const { type } = req.body;
            const userId = req.user.id;

            const existingReaction = await Reaction.findOne({ postId: id, userId });
            if(existingReaction) {
                await existingReaction.remove();
                return res.status(200).json({ message: "Bỏ reaction thành công" });
            }

            await Reaction.create({ postId: id, userId, type });
            res.status(201).json({ message: "Thả reaction thành công" });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xử lý reaction", error });
        }
    },

    /* [POST] api/v1/posts/:id/comments */
    addComment: async (req, res) => {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user.id;

            const comment = new Comment({ postId: id, userId, content });
            await comment.save();

            res.status(201).json({ message: "Bình luận thành công", comment });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi thêm bình luận", error });
        }
    },

    /* [GET] api/v1/posts/:id/comments */
    getComments: async (req, res) => {
        try {
            const { id } = req.params;
            const comments = await Comment.find({ postId: id }).populate("userId", "name avatar");

            res.status(200).json(comments);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy bình luận", error });
        }
    }
};

export default controller;
