const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  emojis: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      emoji: {
        colons: { type: String },
        emoticons: [String],
        id: { type: String },
        name: { type: String },
        native: { type: String },
        short_names: [String],
        skin: { type: Number },
        unified: { type: String },
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model('post', PostSchema);
