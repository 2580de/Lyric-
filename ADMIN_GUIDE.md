# 🔐 Admin Panel & Backend Restructuring Guide

## Overview

The backend has been reorganized with a functional admin system that separates concerns by function and directory:

```
backend/
├── admin/                    # Admin-specific functionality
│   ├── admin-controller.js   # Admin route handlers
│   └── storage-manager.js    # File-based data storage
├── models/                   # Database schemas
├── routes/                   # API route handlers
├── storage/                  # Persistent storage (auto-created)
└── config/                   # Configuration files
```

## Admin System Architecture

### 1. Admin Controller (`admin/admin-controller.js`)

Provides endpoints for:
- Dashboard statistics
- User management
- Post management
- Story management
- Content moderation
- Report handling

### 2. Storage Manager (`admin/storage-manager.js`)

Manages persistent data:
- Admin logs
- User reports
- System settings
- All stored in JSON files in `backend/storage/`

## API Endpoints

### Dashboard

```
GET /api/admin/dashboard
```

Response:
```json
{
  "posts": 42,
  "stories": 15,
  "profiles": 30,
  "totalLikes": 156,
  "totalComments": 89,
  "timestamp": "2026-01-07T..."
}
```

### User Management

```
GET /api/admin/users           - List all users
DELETE /api/admin/users/:id    - Delete user
```

### Post Management

```
GET /api/admin/posts           - List all posts
DELETE /api/admin/posts/:id    - Delete post
```

### Story Management

```
GET /api/admin/stories         - List all stories
DELETE /api/admin/stories/:id  - Delete story
```

### Moderation

```
POST /api/admin/flag/:type/:id
{
  "reason": "inappropriate content"
}
```

### Reports

```
GET /api/admin/reports         - Get all reports
POST /api/admin/report         - File new report
```

### Admin Logs

```
GET /api/admin/logs            - View all admin logs
```

Response:
```json
[
  {
    "id": 1234567890,
    "method": "GET",
    "path": "/api/posts",
    "ip": "127.0.0.1",
    "timestamp": "2026-01-07T10:30:00Z"
  }
]
```

### Settings

```
GET /api/admin/settings        - Get system settings
POST /api/admin/settings       - Update settings
```

## Storage Directory Structure

```
backend/storage/
├── admin-logs.json    # All admin activities
├── reports.json       # User reports
└── settings.json      # System settings
```

### admin-logs.json Example

```json
[
  {
    "id": 1234567890,
    "method": "GET",
    "path": "/api/posts",
    "ip": "127.0.0.1",
    "timestamp": "2026-01-07T10:30:00Z"
  }
]
```

### reports.json Example

```json
[
  {
    "id": 1234567890,
    "type": "post",
    "content_id": "507f1f77bcf86cd799439011",
    "reason": "Inappropriate content",
    "reporter": "user@example.com",
    "status": "pending",
    "timestamp": "2026-01-07T10:30:00Z"
  }
]
```

### settings.json Example

```json
{
  "siteTitle": "SocialApp",
  "maintenanceMode": false,
  "maxPostsPerDay": 100,
  "storyExpiryHours": 24
}
```

## Using Admin Functions

### 1. Access Admin Dashboard

```javascript
// From your app
const response = await fetch('http://localhost:5000/api/admin/dashboard');
const stats = await response.json();
console.log(stats);
```

### 2. Log Admin Action

```javascript
// Automatically logged
const response = await fetch('http://localhost:5000/api/admin/users', {
  method: 'DELETE'
});
// Log created in admin-logs.json
```

### 3. Handle Report

```javascript
// File report
const report = {
  type: 'post',
  content_id: 'post_id',
  reason: 'Spam',
  reporter: 'user@example.com'
};

const response = await fetch('http://localhost:5000/api/admin/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(report)
});

const result = await response.json();
console.log(result.report.id);
```

### 4. Manage Settings

```javascript
// Get settings
const settings = await fetch('http://localhost:5000/api/admin/settings');
const config = await settings.json();

// Update settings
const response = await fetch('http://localhost:5000/api/admin/settings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    maintenanceMode: false,
    maxPostsPerDay: 100
  })
});
```

## Functional Organization

### By Function

```
Admin System Functions:
├── Dashboard
│   └── GET /api/admin/dashboard
│
├── User Management
│   ├── GET /api/admin/users
│   └── DELETE /api/admin/users/:id
│
├── Content Management
│   ├── GET /api/admin/posts
│   ├── DELETE /api/admin/posts/:id
│   ├── GET /api/admin/stories
│   └── DELETE /api/admin/stories/:id
│
├── Moderation
│   └── POST /api/admin/flag/:type/:id
│
├── Reporting
│   ├── GET /api/admin/reports
│   └── POST /api/admin/report
│
├── Logging
│   └── GET /api/admin/logs
│
└── Settings
    ├── GET /api/admin/settings
    └── POST /api/admin/settings
```

## Backend Server Integration

The server automatically:

1. **Initializes admin system** on startup
2. **Creates storage directories** if not exist
3. **Logs all requests** to admin-logs.json
4. **Handles errors gracefully**
5. **Validates all input data**

## Admin Frontend UI

Create an admin dashboard component:

```javascript
import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/dashboard')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {stats && (
        <div>
          <p>Total Posts: {stats.posts}</p>
          <p>Total Stories: {stats.stories}</p>
          <p>Total Users: {stats.profiles}</p>
          <p>Total Likes: {stats.totalLikes}</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
```

## Security Considerations

⚠️ **Important**: Before deploying to production:

1. **Add authentication**
   ```javascript
   // Verify admin token
   const adminToken = req.headers.authorization;
   if (!adminToken) return res.status(401).json({ error: 'Unauthorized' });
   ```

2. **Implement rate limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const adminLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use('/api/admin', adminLimiter);
   ```

3. **Add input validation**
   ```javascript
   const { body, validationResult } = require('express-validator');
   app.post('/api/admin/settings',
     body('maxPostsPerDay').isInt({ min: 1 }),
     (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) return res.status(400).json({ errors });
     }
   );
   ```

4. **Encrypt sensitive data**
   ```javascript
   const crypto = require('crypto');
   // Encrypt passwords and sensitive info
   ```

5. **Set up access control**
   ```javascript
   // Only admin users can access
   const adminOnly = (req, res, next) => {
     if (!req.user?.isAdmin) return res.status(403).json({ error: 'Forbidden' });
     next();
   };
   app.use('/api/admin', adminOnly);
   ```

## Monitoring & Debugging

### View Admin Logs

```bash
# Check logs in real-time
tail -f backend/storage/admin-logs.json

# Or in Node.js
const { adminLogs } = require('./admin/storage-manager');
console.log(adminLogs.getAll());
```

### Clear Logs

```javascript
const { adminLogs } = require('./admin/storage-manager');
adminLogs.clear();
```

### Check Reports

```javascript
const { reports } = require('./admin/storage-manager');
const allReports = reports.getAll();
console.log(allReports);
```

## Maintenance Tasks

### Regular Cleanup

```javascript
// Delete old logs (older than 30 days)
const fs = require('fs');
const logsPath = './backend/storage/admin-logs.json';
const logs = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
const recentLogs = logs.filter(log => new Date(log.timestamp) > thirtyDaysAgo);
fs.writeFileSync(logsPath, JSON.stringify(recentLogs, null, 2));
```

### Archive Reports

```javascript
// Backup resolved reports
const { reports } = require('./admin/storage-manager');
const allReports = reports.getAll();
const resolvedReports = allReports.filter(r => r.status === 'resolved');
// Save to archive file or database
```

## Testing Admin Endpoints

### Using cURL

```bash
# Get dashboard stats
curl http://localhost:5000/api/admin/dashboard

# List all users
curl http://localhost:5000/api/admin/users

# List all posts
curl http://localhost:5000/api/admin/posts

# Get admin logs
curl http://localhost:5000/api/admin/logs

# Get settings
curl http://localhost:5000/api/admin/settings
```

### Using Postman

1. Create collection: "SocialApp Admin"
2. Add requests:
   - GET /api/admin/dashboard
   - GET /api/admin/users
   - GET /api/admin/posts
   - GET /api/admin/reports
   - GET /api/admin/settings
3. Save and test

---

**Admin System Ready! 🎯**
