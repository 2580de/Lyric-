const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// Get all active stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    }).sort({ timestamp: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create story
router.post('/', async (req, res) => {
  const story = new Story({
    author: req.body.author,
    image: req.body.image,
    timestamp: new Date(),
    expiresAt: req.body.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  try {
    const newStory = await story.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View story
router.put('/:id/view', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    if (!story.viewedBy.includes(req.body.userId)) {
      story.viewedBy.push(req.body.userId);
      story.views += 1;
    }

    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete story
router.delete('/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
