const express = require('express');
const Music = require('../models/Music');
const router = express.Router();

// Get all music
router.get('/', async (req, res) => {
  try {
    const { genre, artist, search } = req.query;
    let query = {};

    if (genre) query.genre = genre;
    if (artist) query.artist = { $regex: artist, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
      ];
    }

    const music = await Music.find(query)
      .sort({ plays: -1 })
      .limit(50);
    res.json(music);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get music by ID
router.get('/:id', async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ message: 'Music not found' });
    
    // Increment play count
    music.plays += 1;
    await music.save();
    
    res.json(music);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create music (artist upload)
router.post('/', async (req, res) => {
  const music = new Music({
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    duration: req.body.duration,
    imageUrl: req.body.imageUrl,
    audioUrl: req.body.audioUrl,
    spotifyId: req.body.spotifyId,
    genre: req.body.genre || [],
    uploadedBy: req.body.uploadedBy,
  });

  try {
    const savedMusic = await music.save();
    res.status(201).json(savedMusic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Like music
router.put('/:id/like', async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ message: 'Music not found' });

    const userId = req.body.userId;
    const index = music.likedBy.indexOf(userId);

    if (index === -1) {
      music.likedBy.push(userId);
      music.likes.push({ userId });
    } else {
      music.likedBy.splice(index, 1);
      music.likes = music.likes.filter(like => like.userId.toString() !== userId);
    }

    const updatedMusic = await music.save();
    res.json(updatedMusic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete music
router.delete('/:id', async (req, res) => {
  try {
    await Music.findByIdAndDelete(req.params.id);
    res.json({ message: 'Music deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
