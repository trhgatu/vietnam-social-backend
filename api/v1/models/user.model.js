import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUID: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        unique: true,
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    avatar: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    nickname: {
        type: String,
    },
    refreshTokens: [String],
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favoriteSong: {
        trackId: String,
        title: String,
        artist: String,
        album: String,
        imageUrl: String,
        spotifyUrl: String,
    },

});
userSchema.virtual('friendsCount').get(function () {
    return this.friends ? this.friends.length : 0;
});

userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    return userObject;
};
const User = mongoose.model('User', userSchema, 'users')

export default User
