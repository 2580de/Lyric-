const express = require('express');
const Lyrics = require('../models/Lyrics');
const Music = require('../models/Music');
const router = express.Router();

// Get lyrics for a music track
router.get('/music/:musicId', async (req, res) => {
  try {
    const lyrics = await Lyrics.findOne({ musicId: req.params.musicId });
    if (!lyrics) return res.status(404).json({ message: 'Lyrics not found' });

    // Increment view count
    lyrics.views += 1;
    await lyrics.save();

    res.json(lyrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search lyrics
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const lyrics = await Lyrics.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { lyrics: { $regex: q, $options: 'i' } },
      ],
    }).limit(20);

    res.json(lyrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add/Update lyrics
router.post('/', async (req, res) => {
  try {
    let lyrics = await Lyrics.findOne({ musicId: req.body.musicId });

    if (!lyrics) {
      lyrics = new Lyrics({
        musicId: req.body.musicId,
        title: req.body.title,
        artist: req.body.artist,
        lyrics: req.body.lyrics,
        language: req.body.language || 'en',
        synced: req.body.synced || false,
        syncedLyrics: req.body.syncedLyrics || [],
      });
    } else {
      lyrics.lyrics = req.body.lyrics;
      if (req.body.syncedLyrics) lyrics.syncedLyrics = req.body.syncedLyrics;
      if (req.body.translations) lyrics.translations = req.body.translations;
    }

    const saved = await lyrics.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get synced lyrics (for real-time display)
router.get('/:id/synced', async (req, res) => {
  try {
    const lyrics = await Lyrics.findById(req.params.id);
    if (!lyrics) return res.status(404).json({ message: 'Lyrics not found' });

    if (!lyrics.synced) {
      return res.status(400).json({ message: 'Lyrics not synced' });
    }

    res.json({
      title: lyrics.title,
      artist: lyrics.artist,
      syncedLyrics: lyrics.syncedLyrics,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
