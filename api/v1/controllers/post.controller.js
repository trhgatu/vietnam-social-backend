import Post from "../models/post.model.js";
import Reaction from "../models/reaction.model.js";
import Comment from "../models/comment.model.js";
import paginate from "../helpers/paginate.js";
import { getFriendIds } from "../utils/friends.js";
import { getGenericFields } from "../utils/generic-fields.js";

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
    /* [POST] api/v1/posts/create */
    create: async (req, res) => {
        try {
            const { content, media, tags, status, location, feeling } = req.body;

            if(!req.user || !req.user.id) {
                return res.status(401).json({ message: "Không có quyền thực hiện hành động này." });
            }

            const newPost = new Post({
                ...getGenericFields(),
                authorId: req.user.id,
                content,
                media: media || [],
                tags: tags || [],
                status: status || "public",
                location,
                feeling
            });

            const savedPost = await newPost.save();
            res.status(201).json({
                success: true,
                message: "Đăng bài viết thành công",
                savedPost
            });
        } catch(error) {
            console.error("Lỗi khi tạo bài viết:", error);
            res.status(500).json({ message: "Lỗi khi tạo bài viết", error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const post = Post.findByIdAndDelete(id);
            if(!post) {
                return res.status(404).json({ message: "Không tìm thấy bài viết" });
            }
            res.status(200).json({ message: "Xóa bài viết thành công", post });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi xóa bài viết", error });
        }
    }
};

export default controller;
