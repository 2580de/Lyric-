# 🎵 LYRIC - Music & Lyrics Platform

A full-stack music platform with lyrics viewing, music player, and Spotify integration. Features glass-effect UI with Tailwind CSS.

## 🚀 Features

### 🎧 Music Features
- **Music Player**: Play, pause, control volume and progress
- **Lyrics Viewer**: View synced lyrics with glass morphism effect
- **Music Library**: Browse and search music by artist, genre, and title
- **Playback Stats**: Track plays, likes, and listen count

### 📝 Lyrics Features
- **Synced Lyrics**: Time-synchronized lyrics display
- **Translations**: Multi-language lyrics support
- **Glass Effect UI**: Modern frosted glass design with Tailwind CSS
- **Interactive**: Click lyrics to jump to specific timestamps

### 🎵 Spotify Integration
- **Separate Connections**: Artists and listeners connect independently
- **Top Tracks**: View and link your Spotify top tracks
- **Playlist Sync**: Import playlists from Spotify
- **Artist Mode**: Upload and manage music
- **Listener Mode**: Discover and save music

### 🎨 UI/UX
- **Glass Morphism**: Modern glass effect using Tailwind CSS
- **Dark Theme**: Beautiful dark gradient backgrounds
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Fluid transitions and interactions

## 🏗️ Architecture

### Frontend
- **React 18**: Modern component-based UI
- **Tailwind CSS**: Utility-first CSS with glass effects
- **Axios**: HTTP client for API calls
- **Components**:
  - `MusicPlayer.js` - Audio playback with controls
  - `LyricsViewer.js` - Synced lyrics with glass effect
  - `SpotifyConnect.js` - Spotify OAuth integration
  - `App.js` - Main routing and navigation

### Backend
- **Node.js + Express**: REST API server
- **MongoDB**: NoSQL database
- **Models**:
  - `Music.js` - Track metadata, plays, likes
  - `Lyrics.js` - Lyrics text, synced timestamps, translations
  - `SpotifyIntegration.js` - Spotify account connection data
- **Routes**:
  - `/api/music` - Music CRUD and interactions
  - `/api/lyrics` - Lyrics management
  - `/api/spotify` - Spotify authentication and sync
- `PUT /:id/like` - Like a post
- `POST /:id/comment` - Comment on post
- `PUT /:id/share` - Share a post
- `PUT /:id/save` - Save a post
- `DELETE /:id` - Delete a post
- `PATCH /:id` - Update a post

#### Stories API (`/api/stories`)
- `GET /` - Get all active stories
- `GET /:id` - Get single story
- `POST /` - Create new story
- `PUT /:id/view` - Mark story as viewed
- `DELETE /:id` - Delete a story

#### Profile API (`/api/profile`)
- `GET /` - Get user profile
- `GET /:username` - Get profile by username
- `POST /` - Create profile
- `PUT /` - Update profile
- `PUT /:username/follow` - Follow user
- `PUT /:username/unfollow` - Unfollow user
- `GET /saved/posts` - Get saved posts

### Database Models

#### Post Schema
```javascript
{
  author: String,
  content: String,
  image: String,
  likes: Number,
  likedBy: [String],
  comments: [{author, text, timestamp}],
  shares: Number,
  savedBy: [String],
  timestamp: Date,
  updatedAt: Date
}
```

#### Story Schema
```javascript
{
  author: String,
  image: String,
  views: Number,
  viewedBy: [String],
  timestamp: Date,
  expiresAt: Date
}
```

#### Profile Schema
```javascript
{
  username: String,
  email: String,
  avatar: String,
  bio: String,
  postsCount: Number,
  followersCount: Number,
  followingCount: Number,
  followers: [ObjectId],
  following: [ObjectId],
  posts: [ObjectId],
  savedPosts: [ObjectId],
  createdAt: Date
}
```

## 📁 Project Structure

```
Lyric-/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Feed.js
│   │   │   ├── Post.js
│   │   │   ├── Stories.js
│   │   │   ├── Profile.js
│   │   │   ├── Room.js
│   │   │   └── AdminDashboard.js
│   │   ├── styles/
│   │   │   ├── app.css
│   │   │   ├── feed.css
│   │   │   ├── post.css
│   │   │   ├── stories.css
│   │   │   ├── profile.css
│   │   │   └── room.css
│   │   └── App.js
│   ├── HTML files (legacy)
│   └── CSS files (legacy)
├── backend/
│   ├── models/
│   │   ├── Post.js
│   │   ├── Story.js
│   │   └── Profile.js
│   ├── routes/
│   │   ├── posts.js
│   │   ├── stories.js
│   │   ├── profile.js
│   │   ├── admin.js
│   │   └── rooms.js
│   └── server.js
└── README.md
```

## 🔧 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install express mongoose cors dotenv
```

3. Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/socialapp
PORT=5000
```

4. Start server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install react react-dom
```

3. Start development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## 🎨 Styling

All components use Instagram-inspired design with:
- Blue accent color (#0095f6)
- Gray secondary colors
- Rounded corners and shadows
- Responsive grid layouts
- Smooth animations and transitions

## 🔐 Authentication

The current implementation uses anonymous users. For production, implement:
- JWT authentication
- Password hashing with bcrypt
- Session management
- User registration/login

## 📱 Responsive Design

All components are mobile-responsive with breakpoints for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚧 Future Enhancements

- User authentication and authorization
- Image upload to cloud storage
- Real-time notifications
- Search functionality
- Trending posts/hashtags
- User recommendations
- Video posts
- Live streaming
- Push notifications
- Dark mode

## 📄 License

MIT License

## 👨‍💻 Contributors

Your Name Here

---

**Built with ❤️ using React and Node.js**
