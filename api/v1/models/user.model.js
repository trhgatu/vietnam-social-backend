import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role : {
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
    }

})
const User = mongoose.model('User', userSchema, 'users')

export default User
