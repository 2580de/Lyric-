const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    artist: {
      type: String,
      required: true,
      index: true,
    },
    album: String,
    duration: Number, // in seconds
    imageUrl: String,
    audioUrl: String,
    spotifyId: {
      type: String,
      unique: true,
      sparse: true,
    },
    genre: [String],
    plays: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        userId: mongoose.Schema.Types.ObjectId,
      },
    ],
    likedBy: [mongoose.Schema.Types.ObjectId],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Music', musicSchema);
