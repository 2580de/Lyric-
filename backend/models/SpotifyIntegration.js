const mongoose = require('mongoose');

const spotifyIntegrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      enum: ['artist', 'listener'],
      required: true,
    },
    spotifyId: {
      type: String,
      required: true,
      unique: true,
    },
    spotifyUsername: String,
    displayName: String,
    email: String,
    profileImage: String,
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: String,
    expiresAt: Date,
    followers: Number,
    following: Number,
    genres: [String],
    popularity: Number,
    linkedTracks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music',
      },
    ],
    playlists: [
      {
        spotifyPlaylistId: String,
        name: String,
        tracks: Number,
      },
    ],
    connectedAt: {
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

module.exports = mongoose.model('SpotifyIntegration', spotifyIntegrationSchema);
