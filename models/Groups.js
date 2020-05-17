const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  posts: [
    {
      title: {
        type: String,
        required: true,
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      comments: [
        {
          creator: {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
          text: {
            type: String,
            required: true,
            trim: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      dateJoined: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Group = mongoose.model("group", GroupSchema);
