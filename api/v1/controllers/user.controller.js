import User from "../models/user.model.js";

const controller = {
    /* [GET] api/v1/users/:username */
    getUserByUsername: async (req, res) => {
        try {
            const { username } = req.params;
            const user = await User.findOne({ username }).select("-password");

            if(!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            res.status(200).json(user);
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi lấy thông tin user", error });
        }
    },
    /* [POST] api/v1/users/bulk-create */
    createUsers: async (req, res) => {
        try {
            const users = req.body;
            users.map(user => ({
                ...user,
            }));
            const createdUsers = await User.insertMany(users);

            res.status(201).json({ message: "Tạo users thành công", users: createdUsers });
        } catch(error) {
            res.status(500).json({ message: "Lỗi khi tạo users", error });
        }
    }

};

export default controller;
