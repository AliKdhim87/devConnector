const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  events: [
    {
      title: { 
        type: String, 
        required: true 
      },
      description: { 
        type: String 
      },
      start: { 
        type: Date, required: true 
      },
      end: { 
        type: Date 
      },
      creator:{
        type: Schema.Types.ObjectId,
        ref:'user'
      }
    }
  ],
  posts: [
    {
      title: {
        type: String,
        required: true
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      text: {
        type: String,
        required: true
      },
      link:{
        type:String
      },
      date: {
        type: Date,
        default: Date.now
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      comments: [
        {
          creator: {
            type: Schema.Types.ObjectId,
            ref: 'user'
          },
          text: {
            type: String,
            required: true,
            trim: true
          },
          date: {
            type: Date,
            default: Date.now
          },
          avatar: {
            type: String
          },
          name: {
            type: String
          },
          userId: {
            type: String
          }
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      dateJoined: {
        type: Date,
        default: Date.now
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ]
});

module.exports = Group = mongoose.model('group', GroupSchema);
