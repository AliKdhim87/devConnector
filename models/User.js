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
      groups: {
        type: Schema.Types.ObjectId,
        ref: 'group'
      }
    }
  ]
});

module.exports = User = mongoose.model('user', userSchema);
