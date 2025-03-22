import crypto from "crypto";

const otpStore = new Map();

export const generateOTP = (email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    return otp;
};

export const verifyOTP = (email, otp) => {
    const storedOTP = otpStore.get(email);
    if (!storedOTP) return false;

    if (storedOTP.otp === otp && Date.now() < storedOTP.expiresAt) {
        otpStore.delete(email);
        return true;
    }
    return false;
};
