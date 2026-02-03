const express = require('express');
const SpotifyIntegration = require('../models/SpotifyIntegration');
const Music = require('../models/Music');
const axios = require('axios');
const router = express.Router();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'your_spotify_client_id';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'your_spotify_client_secret';
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/spotify/callback';

// Get Spotify auth URL
router.get('/auth-url', (req, res) => {
  const scopes = 'user-read-private user-read-email user-library-read user-top-read playlist-modify-public playlist-modify-private streaming user-read-playback-state user-modify-playback-state';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
  
  res.json({ authUrl });
});

// Handle Spotify callback
router.post('/callback', async (req, res) => {
  const { code, userId, userType } = req.body;

  try {
    // Exchange code for access token
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      },
      {
        auth: {
          username: SPOTIFY_CLIENT_ID,
          password: SPOTIFY_CLIENT_SECRET,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Get user info from Spotify
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const spotifyUser = userResponse.data;

    // Save or update Spotify integration
    let integration = await SpotifyIntegration.findOne({ userId });

    if (!integration) {
      integration = new SpotifyIntegration({
        userId,
        userType,
        spotifyId: spotifyUser.id,
        spotifyUsername: spotifyUser.display_name,
        displayName: spotifyUser.display_name,
        email: spotifyUser.email,
        profileImage: spotifyUser.images?.[0]?.url,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000),
        followers: spotifyUser.followers?.total,
      });
    } else {
      integration.accessToken = access_token;
      integration.refreshToken = refresh_token;
      integration.expiresAt = new Date(Date.now() + expires_in * 1000);
      integration.displayName = spotifyUser.display_name;
      integration.profileImage = spotifyUser.images?.[0]?.url;
    }

    await integration.save();
    res.json({ success: true, integration });
  } catch (err) {
    res.status(400).json({ message: 'Failed to authenticate with Spotify', error: err.message });
  }
});

// Get user's Spotify integration
router.get('/:userId', async (req, res) => {
  try {
    const integration = await SpotifyIntegration.findOne({ userId: req.params.userId });
    if (!integration) return res.status(404).json({ message: 'Not connected to Spotify' });

    res.json(integration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's top tracks from Spotify
router.get('/:userId/top-tracks', async (req, res) => {
  try {
    const integration = await SpotifyIntegration.findOne({ userId: req.params.userId });
    if (!integration) return res.status(404).json({ message: 'Not connected to Spotify' });

    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${integration.accessToken}`,
      },
      params: {
        limit: 20,
      },
    });

    res.json(response.data.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's playlists
router.get('/:userId/playlists', async (req, res) => {
  try {
    const integration = await SpotifyIntegration.findOne({ userId: req.params.userId });
    if (!integration) return res.status(404).json({ message: 'Not connected to Spotify' });

    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${integration.accessToken}`,
      },
      params: {
        limit: 20,
      },
    });

    res.json(response.data.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Disconnect Spotify
router.delete('/:userId', async (req, res) => {
  try {
    await SpotifyIntegration.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Spotify account disconnected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Link Spotify track to platform
router.post('/:userId/link-track', async (req, res) => {
  try {
    const integration = await SpotifyIntegration.findOne({ userId: req.params.userId });
    if (!integration) return res.status(404).json({ message: 'Not connected to Spotify' });

    const music = new Music({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      imageUrl: req.body.imageUrl,
      spotifyId: req.body.spotifyId,
      uploadedBy: req.params.userId,
    });

    const saved = await music.save();
    
    integration.linkedTracks.push(saved._id);
    await integration.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
