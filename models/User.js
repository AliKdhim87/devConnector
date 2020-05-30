const mongoose = require('mongoose');
const { ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
  avatar_id: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  friends: [
    {
      type: ObjectId,
      ref: 'User',
     }
  ],
  friendRequests: [
    {
      user: { type: ObjectId},
      date: Date,
      isSent: Boolean,
    },
  ],
});

module.exports = User = mongoose.model('user', userSchema);
