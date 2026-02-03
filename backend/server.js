require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const postsRoutes = require('./routes/posts');
const storiesRoutes = require('./routes/stories');
const profileRoutes = require('./routes/profile');
const musicRoutes = require('./routes/music');
const lyricsRoutes = require('./routes/lyrics');
const spotifyRoutes = require('./routes/spotify');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/lyrics', lyricsRoutes);
app.use('/api/spotify', spotifyRoutes);

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false }
});
module.exports = mongoose.model('User', UserSchema);

app.listen(5000, () => console.log('Server running on port 5000'));