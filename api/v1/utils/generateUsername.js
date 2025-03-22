import crypto from "crypto";

export const generateUsername = (email) => {
    const emailPrefix = email.split("@")[0];
    const cleanName = emailPrefix;
    const randomString = crypto.randomBytes(3).toString("hex");

    return `${cleanName}_${randomString}`;
};
