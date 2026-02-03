const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String,
    default: []
  }],
  comments: [{
    author: String,
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  savedBy: [{
    type: String,
    default: []
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
