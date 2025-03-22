import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/jwt.js";
import { sendOTPEmail } from "../utils/email.js";
import { generateOTP, verifyOTP } from "../utils/otp.js";
import { generateUsername } from "../utils/generateUsername.js";

const controller = {
    /* [POST] api/v1/auth/login */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if(!user) {
                return res.status(400).json({
                    success: false,
                    message: "Email hoặc mật khẩu không đúng",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Email hoặc mật khẩu không đúng",
                });
            }

            const { accessToken, refreshToken } = generateTokens(user);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công",
                accessToken,
                user: {
                    avatar: user.avatar,
                    email: user.email,
                    name: user.name,
                    coverPhoto: user.coverPhoto,
                    nickname: user.nickname,
                },
            });
        } catch(error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    },

    /* [POST] api/v1/auth/firebase-login */
    firebaseLogin: async (req, res) => {
        try {
            const user = req.user;
            const { accessToken, refreshToken } = generateTokens(user);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.json({ success: true, accessToken, user });
        } catch(error) {
            console.error("Firebase Login Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    /* [POST] api/v1/auth/logout */
    logout: async (req, res) => {
        try {
            res.clearCookie("refreshToken");
            return res.status(200).json({
                success: true,
                message: "Đăng xuất thành công",
            });
        } catch(error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    },

    /* [GET] api/v1/auth/me */
    me: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if(!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                success: true,
                user,
            });
        } catch(error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    },

    /* [POST] api/v1/auth/refresh */
    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
                if(err) {
                    return res.status(403).json({ success: false, message: "Invalid refresh token" });
                }

                const user = await User.findById(decoded.id);
                if(!user) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }

                const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.status(200).json({ success: true, accessToken });
            });
        } catch(error) {
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },
    /* [POST] api/v1/auth/register/send-otp */
    sendOTP: async (req, res) => {
        try {
            const { email } = req.body;
            let user = await User.findOne({ email });

            if(user) {
                if(user.isVerified) {
                    return res.status(400).json({ success: false, message: "Email đã được đăng ký và xác minh, vui lòng đăng nhập" });
                }
            } else {
                user = new User({ email, isVerified: false });
            }

            const otp = generateOTP();
            user.otp = otp;
            user.otpExpires = Date.now() + 5 * 60 * 1000;
            await user.save();
            await sendOTPEmail(email, otp);

            return res.status(200).json({ success: true, message: "OTP đã được gửi đến email của bạn" });
        } catch(error) {
            console.error("Lỗi khi gửi OTP:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi gửi OTP" });
        }
    },

    /* [POST] api/v1/auth/register/verify-otp */
    verifyOTP: async (req, res) => {
        try {
            const { email, otp } = req.body;
            const user = await User.findOne({ email });

            if(!user || !user.otp || user.otpExpires < Date.now()) {
                return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn" });
            }

            if(user.otp !== otp) {
                return res.status(400).json({ success: false, message: "OTP không đúng" });
            }

            user.isVerified = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();

            return res.status(200).json({ success: true, message: "OTP hợp lệ, bạn có thể tiếp tục đăng ký" });
        } catch(error) {
            return res.status(500).json({ success: false, message: "Lỗi xác minh OTP" });
        }
    },

    /* [POST] api/v1/auth/register */
    register: async (req, res) => {
        try {
            const { email, name, password } = req.body;
            const user = await User.findOne({ email });

            if(!user || !user.isVerified) {
                return res.status(400).json({ success: false, message: "Email chưa xác thực OTP" });
            }

            if(user.password) {
                return res.status(400).json({ success: false, message: "Tài khoản đã tồn tại" });
            }

            const username = generateUsername(email, name);

            user.name = name;
            user.username = username;
            user.password = await bcrypt.hash(password, 10);
            await user.save();

            return res.status(201).json({ success: true, message: "Đăng ký thành công", username });
        } catch(error) {
            console.error("Lỗi đăng ký:", error);
            return res.status(500).json({ success: false, message: "Lỗi đăng ký" });
        }
    },
};

export default controller;
