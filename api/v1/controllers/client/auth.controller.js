import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const controller = {
    /* [POST] api/v1/auth/login */
    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                code: 400,
                message: 'Email không tồn tại',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({
                code: 400,
                message: "Sai mật khẩu!",
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json(
            {
                token,
                user: {
                    id: user._id,
                    email: user.email
                }
            }
        );
    },

    register: async (req, res) => {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);


        if(userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        await User.create(
            {
                email, password: hashedPassword
            }
        );

        res.status(201).json({ message: "User registered successfully" });

    }
}
export default controller;