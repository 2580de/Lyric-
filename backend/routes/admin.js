const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.get('/rooms', (req, res) => {
  res.json([{ id: 1, name: 'Room 1' }]);
});

router.post('/announcement', (req, res) => {
  // Save announcement logic
  res.json({ success: true });
});

module.exports = router;