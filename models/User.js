const mongoose = require('mongoose');

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
  date: {
    type: Date,
    default: Date.now
  },
  myGroups: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        ref: 'group'
      }
    }
  ],
  privacyOptions: {
    profileVisibility: {
      friends: {
        type: Boolean,
        default: true
      },
      everyOne: {
        type: Boolean,
        default: true
      }
    },
    messages: {
      friends: {
        type: Boolean,
        default: true
      },
      everyOne: {
        type: Boolean,
        default: true
      }
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    social: {
      google: { type: String, default: null },
      github: { type: String, default: null },
      facebook: { type: String, default: null },
    },
  }
});

module.exports = User = mongoose.model('user', userSchema);
