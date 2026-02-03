# 📚 SocialApp API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 📌 Posts Endpoints

### Get All Posts
```
GET /posts
```
**Response:**
```json
[
  {
    "_id": "...",
    "author": "John Doe",
    "content": "My first post!",
    "image": "url",
    "likes": 5,
    "comments": [],
    "shares": 0,
    "timestamp": "2026-01-07T..."
  }
]
```

### Get Single Post
```
GET /posts/:id
```

### Create Post
```
POST /posts
Content-Type: application/json

{
  "author": "John Doe",
  "content": "My post content",
  "image": "image_url" (optional)
}
```

### Like Post
```
PUT /posts/:id/like
```

### Add Comment
```
POST /posts/:id/comment
Content-Type: application/json

{
  "author": "Jane Doe",
  "text": "Great post!"
}
```

### Share Post
```
PUT /posts/:id/share
```

### Save Post
```
PUT /posts/:id/save
Content-Type: application/json

{
  "userId": "user_id"
}
```

### Update Post
```
PATCH /posts/:id
Content-Type: application/json

{
  "content": "Updated content",
  "image": "new_image_url"
}
```

### Delete Post
```
DELETE /posts/:id
```

---

## 📖 Stories Endpoints

### Get All Active Stories
```
GET /stories
```
**Response:**
```json
[
  {
    "_id": "...",
    "author": "John Doe",
    "image": "url",
    "views": 10,
    "timestamp": "2026-01-07T...",
    "expiresAt": "2026-01-08T..."
  }
]
```

### Get Single Story
```
GET /stories/:id
```

### Create Story
```
POST /stories
Content-Type: application/json

{
  "author": "John Doe",
  "image": "image_url",
  "expiresAt": "2026-01-08T..." (optional)
}
```

### View Story
```
PUT /stories/:id/view
Content-Type: application/json

{
  "userId": "user_id"
}
```

### Delete Story
```
DELETE /stories/:id
```

---

## 👤 Profile Endpoints

### Get User Profile
```
GET /profile
```
**Response:**
```json
{
  "_id": "...",
  "username": "johndoe",
  "email": "john@example.com",
  "avatar": "url",
  "bio": "My bio",
  "postsCount": 10,
  "followersCount": 100,
  "followingCount": 50,
  "followers": [],
  "following": [],
  "posts": [],
  "savedPosts": []
}
```

### Get Profile by Username
```
GET /profile/:username
```

### Create Profile
```
POST /profile
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "avatar": "avatar_url" (optional),
  "bio": "My bio" (optional)
}
```

### Update Profile
```
PUT /profile
Content-Type: application/json

{
  "bio": "Updated bio",
  "avatar": "new_avatar_url",
  "username": "newusername"
}
```

### Follow User
```
PUT /profile/:username/follow
```

### Unfollow User
```
PUT /profile/:username/unfollow
```

### Get Saved Posts
```
GET /profile/saved/posts
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## 🔄 Request/Response Examples

### Example 1: Create a Post
**Request:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Jane Doe",
    "content": "Loving this beautiful day!",
    "image": "https://example.com/photo.jpg"
  }'
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "author": "Jane Doe",
  "content": "Loving this beautiful day!",
  "image": "https://example.com/photo.jpg",
  "likes": 0,
  "comments": [],
  "shares": 0,
  "timestamp": "2026-01-07T10:30:00Z"
}
```

### Example 2: Like a Post
**Request:**
```bash
curl -X PUT http://localhost:5000/api/posts/507f1f77bcf86cd799439011/like
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "author": "Jane Doe",
  "content": "Loving this beautiful day!",
  "likes": 1,
  ...
}
```

### Example 3: Add a Comment
**Request:**
```bash
curl -X POST http://localhost:5000/api/posts/507f1f77bcf86cd799439011/comment \
  -H "Content-Type: application/json" \
  -d '{
    "author": "John Doe",
    "text": "Beautiful photo!"
  }'
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "author": "Jane Doe",
  "content": "Loving this beautiful day!",
  "comments": [
    {
      "author": "John Doe",
      "text": "Beautiful photo!",
      "timestamp": "2026-01-07T10:35:00Z"
    }
  ],
  ...
}
```

---

## 🔐 Authentication (Future Implementation)

For production use, add JWT authentication:

```javascript
// Add to requests
Authorization: Bearer <token>
```

---

## 📊 Data Models

### Post
```
{
  author: String,
  content: String,
  image: String (optional),
  likes: Number,
  likedBy: [String],
  comments: [
    {
      author: String,
      text: String,
      timestamp: Date
    }
  ],
  shares: Number,
  savedBy: [String],
  timestamp: Date,
  updatedAt: Date
}
```

### Story
```
{
  author: String,
  image: String,
  views: Number,
  viewedBy: [String],
  timestamp: Date,
  expiresAt: Date (24 hours from creation)
}
```

### Profile
```
{
  username: String (unique),
  email: String (unique),
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

---

## 🚀 Testing the API

### Using Postman
1. Import the endpoints
2. Set base URL: `http://localhost:5000/api`
3. Test each endpoint

### Using cURL
```bash
# Create a post
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"author":"User","content":"Hello","image":""}'

# Get all posts
curl http://localhost:5000/api/posts

# Like a post
curl -X PUT http://localhost:5000/api/posts/[ID]/like
```

### Using JavaScript Fetch
```javascript
// Create post
fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    author: 'User',
    content: 'Hello',
    image: ''
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📋 Rate Limiting

Currently not implemented. Add for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## 🔄 CORS Configuration

Enabled for all origins. Restrict in production:
```javascript
cors({
  origin: ['https://yourdomain.com'],
  credentials: true
})
```

---

**Last Updated:** January 7, 2026
