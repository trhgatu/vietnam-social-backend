import bcrypt from "bcrypt";
import User from "../../models/user.model.js";
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: "Email đã tồn tại!" };
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "ADMIN"
        });

        return { success: true, data: newUser };
    } catch (error) {
        console.error("Lỗi trong createUserService:", error);
        return { success: false, message: "Không thể tạo user" };
    }
};

export { createUserService };
