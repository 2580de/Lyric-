# 🚀 Setup & Installation Guide

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional)

---

## Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd Lyric-

# Or download and extract the zip file
cd Lyric-
```

---

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create Environment File
Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/socialapp

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/socialapp
```

### 2.4 Start MongoDB

**On Windows:**
```bash
# If installed as service, it starts automatically
# Or run:
mongod
```

**On macOS:**
```bash
brew services start mongodb-community
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2.5 Start Backend Server
```bash
npm start
```

You should see:
```
Server running on port 5000
```

### 2.6 Verify Backend is Running
```bash
curl http://localhost:5000/api/posts
```

Should return: `[]` (empty array)

---

## Step 3: Frontend Setup

### 3.1 Open New Terminal/Tab
Keep the backend running!

### 3.2 Navigate to Frontend Directory
```bash
cd frontend
```

### 3.3 Install Dependencies
```bash
npm install
```

### 3.4 Update API URL (if needed)

The frontend uses `http://localhost:5000` as default. If your backend runs on a different port, update:

**File:** `frontend/src/components/Feed.js`
```javascript
const response = await fetch('http://YOUR_BACKEND_URL/api/posts');
```

### 3.5 Start Frontend Dev Server
```bash
npm start
```

Your browser should automatically open at `http://localhost:3000`

---

## Step 4: Test the Application

### 4.1 Create a Post
1. Scroll to "Create Post" form
2. Type your message
3. Add image URL (optional)
4. Click "Post"

### 4.2 Like a Post
1. Click the "❤️ Like" button on any post
2. See the count increase

### 4.3 Comment on a Post
1. Click "💬 Comment"
2. Type your comment
3. Click "Post"

### 4.4 Create a Story
1. Go to Stories section
2. Paste image URL
3. Click "Add Story"

### 4.5 View Profile
1. Scroll to Profile section
2. Click "Edit Bio" to add/update bio
3. See your posts in grid

---

## Troubleshooting

### Issue: "Cannot GET /api/posts"
**Solution:** Ensure backend server is running on port 5000

```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Issue: "MongoDB connection failed"
**Solution:** Check MongoDB is running

```bash
# Test MongoDB connection
mongosh  # MongoDB Shell
```

### Issue: CORS Error
**Solution:** Backend CORS is already configured. If issues persist:

```javascript
// In backend/server.js, ensure:
const cors = require('cors');
app.use(cors());
```

### Issue: Port Already in Use
**Backend (change port):**
```env
PORT=5001
```

**Frontend:**
```bash
PORT=3001 npm start
```

### Issue: Dependencies Installation Fails
**Solution:** Clear npm cache

```bash
npm cache clean --force
npm install
```

---

## Project Structure Quick Reference

```
Lyric-/
├── backend/
│   ├── models/          # Database schemas
│   │   ├── Post.js
│   │   ├── Story.js
│   │   └── Profile.js
│   ├── routes/          # API endpoints
│   │   ├── posts.js
│   │   ├── stories.js
│   │   ├── profile.js
│   │   └── admin.js
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env (create this)
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── Feed.js
│   │   │   ├── Post.js
│   │   │   ├── Stories.js
│   │   │   ├── Profile.js
│   │   │   ├── Room.js
│   │   │   └── AdminDashboard.js
│   │   ├── styles/      # CSS files
│   │   │   ├── app.css
│   │   │   ├── feed.css
│   │   │   ├── post.css
│   │   │   ├── stories.css
│   │   │   ├── profile.css
│   │   │   └── room.css
│   │   └── App.js
│   └── package.json
│
├── README.md
├── API_DOCUMENTATION.md
└── IMPLEMENTATION_SUMMARY.md
```

---

## Development Commands

### Backend
```bash
# Start development mode
npm run dev  # Requires nodemon

# Start production
npm start
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## Production Deployment

### Backend (Using Heroku)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### Frontend (Using Vercel/Netlify)
```bash
# Build
npm run build

# Deploy the build folder
# For Vercel: vercel
# For Netlify: netlify deploy --prod --dir=build
```

---

## API Server Response Times

| Endpoint | Response Time |
|----------|--------------|
| GET /posts | < 100ms |
| POST /posts | < 200ms |
| PUT /like | < 150ms |
| POST /comment | < 150ms |
| GET /profile | < 100ms |

---

## Database Connection Tips

### Verify MongoDB Running
```bash
mongo  # Open MongoDB shell
# Type: show databases
# Should show your databases
```

### View Collections
```bash
use socialapp
show collections
```

### Check Data
```bash
db.posts.find()
db.stories.find()
db.profiles.find()
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Start MongoDB
3. ✅ Start backend server
4. ✅ Start frontend server
5. 📝 Create test data
6. 🎨 Customize styles
7. 🔐 Add authentication (see future enhancements)
8. 🚀 Deploy to production

---

## Support

### Common Issues
- [CORS Errors](#cors-error)
- [MongoDB Connection](#mongodb-connection-failed)
- [Port Already in Use](#port-already-in-use)

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [README](./README.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

---

## Environment Variables Reference

### Backend `.env` File
```env
# Required
MONGO_URI=mongodb://localhost:27017/socialapp
PORT=5000

# Optional
NODE_ENV=development
LOG_LEVEL=debug
```

---

**Happy coding! 🚀**
