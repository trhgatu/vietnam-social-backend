import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vui lòng cung cấp người dùng gửi lời mời']
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vui lòng cung cấp người dùng nhận lời mời']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

friendRequestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

friendRequestSchema.pre('save', function(next) {
  if (this.fromUser.toString() === this.toUser.toString()) {
    next(new Error('Không thể gửi lời mời kết bạn cho chính mình'));
  } else {
    next();
  }
});

export default mongoose.model('FriendRequest', friendRequestSchema);