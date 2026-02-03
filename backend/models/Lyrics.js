const mongoose = require('mongoose');

const lyricsSchema = new mongoose.Schema(
  {
    musicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Music',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    lyrics: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    translations: [
      {
        language: String,
        lyrics: String,
      },
    ],
    synced: {
      type: Boolean,
      default: false,
    },
    syncedLyrics: [
      {
        timestamp: Number, // in milliseconds
        text: String,
      },
    ],
    source: String, // genius, azlyrics, etc.
    views: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Lyrics', lyricsSchema);
