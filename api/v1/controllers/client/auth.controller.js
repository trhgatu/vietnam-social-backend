import User from "../../models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const controller = {
    /* [POST] api/v1/auth/login */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Email hoặc mật khẩu không đúng",
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Email hoặc mật khẩu không đúng",
                });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.cookie("sessionToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });


            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công",
                token,
                user: {
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    },

};

export default controller;
