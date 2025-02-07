import Post from "../../models/post.model.js";

const controller = {
    /* [GET] api/v1/posts */
    index: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: -1 });
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết", error });
        }
    }
};

export default controller;
