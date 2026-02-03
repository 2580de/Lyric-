const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const Post = require('../models/Post');

// Get user profile
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne().populate('posts');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get profile by username
router.get('/:username', async (req, res) => {
  try {
    const profile = await Profile.findOne({ username: req.params.username }).populate('posts');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create profile
router.post('/', async (req, res) => {
  const profile = new Profile({
    username: req.body.username,
    email: req.body.email,
    avatar: req.body.avatar || 'https://via.placeholder.com/100',
    bio: req.body.bio || ''
  });

  try {
    const newProfile = await profile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update profile
router.put('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (req.body.bio !== undefined) profile.bio = req.body.bio;
    if (req.body.avatar !== undefined) profile.avatar = req.body.avatar;
    if (req.body.username !== undefined) profile.username = req.body.username;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Follow user
router.put('/:username/follow', async (req, res) => {
  try {
    const userProfile = await Profile.findOne();
    const targetProfile = await Profile.findOne({ username: req.params.username });

    if (!userProfile || !targetProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (!userProfile.following.includes(targetProfile._id)) {
      userProfile.following.push(targetProfile._id);
      userProfile.followingCount += 1;

      targetProfile.followers.push(userProfile._id);
      targetProfile.followersCount += 1;

      await userProfile.save();
      await targetProfile.save();
    }

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Unfollow user
router.put('/:username/unfollow', async (req, res) => {
  try {
    const userProfile = await Profile.findOne();
    const targetProfile = await Profile.findOne({ username: req.params.username });

    if (!userProfile || !targetProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const followingIndex = userProfile.following.indexOf(targetProfile._id);
    if (followingIndex > -1) {
      userProfile.following.splice(followingIndex, 1);
      userProfile.followingCount -= 1;

      const followerIndex = targetProfile.followers.indexOf(userProfile._id);
      targetProfile.followers.splice(followerIndex, 1);
      targetProfile.followersCount -= 1;

      await userProfile.save();
      await targetProfile.save();
    }

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get saved posts
router.get('/saved/posts', async (req, res) => {
  try {
    const profile = await Profile.findOne().populate('savedPosts');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile.savedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
