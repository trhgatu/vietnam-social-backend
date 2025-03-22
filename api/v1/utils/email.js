import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Mã OTP đăng ký tài khoản",
        text: `Mã OTP của bạn là: ${otp}. OTP có hiệu lực trong 5 phút.`,
    };

    await transporter.sendMail(mailOptions);
};
