import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
})
const User = mongoose.model('User', userSchema, 'users')

export default User
