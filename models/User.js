const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  avatar_id: {
    type: String
  },
  notifications: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },

  friends: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  friendRequests: [
    {
      user: { type: ObjectId },
      date: Date,
      isSent: Boolean
    }
  ],
  myGroups: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        ref: 'group'
      }
    }
  ],
  privacyOptions: {
    profileVisibleEveryone: {
      type: Boolean,
      default: true
    },
    messagesEveryone: {
      type: Boolean,
      default: true
    }
  },
  social: {
    google: { type: String, default: null },
    github: { type: String, default: null },
    facebook: { type: String, default: null }
  },
  active: {
    type: Boolean,
    default: false
  },
  verifyAccountToken: String,
  verifyAccountExpires: Date
});
userSchema.methods.generateAccountVerify = function () {
  this.verifyAccountToken = crypto.randomBytes(20).toString('hex');
  this.verifyAccountExpires = Date.now() + 3600000;
};
module.exports = User = mongoose.model('user', userSchema);
