const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Story = require('../models/Story');
const Profile = require('../models/Profile');

// Admin Dashboard - Get Statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalStories = await Story.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalLikes = await Post.aggregate([{ $group: { _id: null, totalLikes: { $sum: '$likes' } } }]);
    const totalComments = await Post.aggregate([{ $group: { _id: null, totalComments: { $sum: { $size: '$comments' } } } }]);

    res.json({
      posts: totalPosts,
      stories: totalStories,
      profiles: totalProfiles,
      totalLikes: totalLikes[0]?.totalLikes || 0,
      totalComments: totalComments[0]?.totalComments || 0,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const profiles = await Profile.find().select('-savedPosts -followers -following');
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post Management
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Story Management
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find().sort({ timestamp: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/stories/:id', async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Content Moderation
router.post('/flag/:type/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    // Store flag in admin log
    res.json({ 
      message: 'Content flagged for review',
      type: req.params.type,
      id: req.params.id,
      reason
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reports
router.get('/reports', async (req, res) => {
  try {
    const reports = require('../storage/reports.json');
    res.json(reports);
  } catch (error) {
    res.json([]);
  }
});

module.exports = router;
