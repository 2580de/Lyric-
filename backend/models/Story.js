const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    type: String,
    default: []
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
});

// Auto-delete expired stories
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema);
