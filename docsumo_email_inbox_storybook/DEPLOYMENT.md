# Production Deployment Guide

This guide explains how to deploy the Docsumo Email Inbox with Gmail integration to the cloud.

## Architecture Overview

### Current (Development)
- Frontend: localhost:5174 (Vite)
- Backend: localhost:3001 (Express)
- Token Storage: In-memory (lost on restart)

### Production
- Frontend: Netlify (static hosting)
- Backend: Railway, Render, or Fly.io (Node.js server)
- Token Storage: Redis or PostgreSQL (persistent)
- Database: PostgreSQL (user data, email metadata)

## Required Changes

### 1. Backend Deployment (Required)

Netlify only hosts static sites. You need a separate backend server.

**Recommended Platforms:**
- **Railway** (easiest, free tier) - https://railway.app
- **Render** (good free tier) - https://render.com
- **Fly.io** (global edge) - https://fly.io

### 2. Database for Token Storage (Required)

Currently tokens are stored in-memory and lost on restart. For production:

```javascript
// Instead of:
const tokenStore = new Map();

// Use Redis or PostgreSQL:
// Option A: Redis (fast, ephemeral)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Option B: PostgreSQL (persistent, with user data)
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

### 3. Environment Variables

**Backend (.env for production):**
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-production-secret
GOOGLE_REDIRECT_URI=https://api.your-domain.com/api/auth/google/callback

# Frontend URL
FRONTEND_URL=https://your-app.netlify.app

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://user:pass@host:6379

# Security
JWT_SECRET=your-random-secret-key
SESSION_SECRET=another-random-secret

# Server
PORT=3001
NODE_ENV=production
```

**Frontend (.env for production):**
```env
VITE_API_URL=https://api.your-domain.com
```

### 4. Google Cloud Console Updates

1. **Add Production Redirect URI:**
   - Go to https://console.cloud.google.com/apis/credentials
   - Edit your OAuth client
   - Add: `https://api.your-domain.com/api/auth/google/callback`

2. **Add Production JavaScript Origin:**
   - Add: `https://your-app.netlify.app`
   - Add: `https://api.your-domain.com`

3. **Submit for OAuth Verification:**
   - Go to OAuth consent screen
   - Click "Publish App"
   - Submit for verification (required to remove "unverified app" warning)

### 5. Security Enhancements

For production, add these security measures:

```javascript
// server/index.js additions

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// HTTPS enforcement
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
```

---

## Step-by-Step Deployment

### Step 1: Deploy Backend to Railway

1. **Create Railway account:** https://railway.app

2. **Create new project from GitHub:**
   - Connect your GitHub repo
   - Select the `docsumo_email_inbox_storybook/server` folder

3. **Add environment variables:**
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=https://your-railway-app.railway.app/api/auth/google/callback
   FRONTEND_URL=https://your-app.netlify.app
   PORT=3001
   NODE_ENV=production
   ```

4. **Get your Railway URL:**
   - e.g., `https://docsumo-email-api.railway.app`

### Step 2: Deploy Frontend to Netlify

1. **Update frontend environment:**
   
   Create `docsumo_email_inbox_storybook/.env.production`:
   ```
   VITE_API_URL=https://your-railway-app.railway.app
   ```

2. **Deploy to Netlify:**
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Set environment variable: `VITE_API_URL`

### Step 3: Update Google OAuth

1. Go to Google Cloud Console → Credentials
2. Add authorized redirect URIs:
   - `https://your-railway-app.railway.app/api/auth/google/callback`
3. Add authorized JavaScript origins:
   - `https://your-app.netlify.app`
   - `https://your-railway-app.railway.app`

### Step 4: Add Database (Railway)

1. In Railway, click "New" → "Database" → "PostgreSQL"
2. Copy the `DATABASE_URL` connection string
3. Add to your backend environment variables

---

## Code Changes Required

### 1. Update server/index.js for production

```javascript
// Add at top
import helmet from 'helmet';

// Update CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));

// Add security headers
app.use(helmet());
```

### 2. Add database token storage

Create `server/db.js`:
```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create tokens table
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS oauth_tokens (
      email VARCHAR(255) PRIMARY KEY,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      expiry_date BIGINT,
      user_info JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function saveToken(email, tokens, userInfo) {
  await pool.query(
    `INSERT INTO oauth_tokens (email, access_token, refresh_token, expiry_date, user_info, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (email) DO UPDATE SET
       access_token = $2,
       refresh_token = COALESCE($3, oauth_tokens.refresh_token),
       expiry_date = $4,
       user_info = $5,
       updated_at = NOW()`,
    [email, tokens.access_token, tokens.refresh_token, tokens.expiry_date, userInfo]
  );
}

export async function getToken(email) {
  const result = await pool.query(
    'SELECT * FROM oauth_tokens WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

export async function deleteToken(email) {
  await pool.query('DELETE FROM oauth_tokens WHERE email = $1', [email]);
}

export default pool;
```

### 3. Update frontend API URL

Update `src/hooks/useGmailAuth.ts`:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## Production Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Frontend deployed to Netlify
- [ ] PostgreSQL database provisioned
- [ ] Environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] Google OAuth JavaScript origins updated
- [ ] Gmail API enabled in Google Cloud
- [ ] OAuth app submitted for verification
- [ ] HTTPS working on both frontend and backend
- [ ] Rate limiting enabled
- [ ] Error logging configured (Sentry, LogRocket)
- [ ] Token refresh logic implemented

---

## Cost Estimates

| Service | Free Tier | Paid |
|---------|-----------|------|
| Netlify (Frontend) | 100GB bandwidth/month | $19/month Pro |
| Railway (Backend) | $5 credit/month | $0.000231/min |
| Railway PostgreSQL | 1GB free | $5/month |
| Google Gmail API | 15,000 requests/day | Free (quota) |

**Estimated Monthly Cost:** $0-10/month for low traffic

---

## Alternative: Netlify Functions (Serverless)

If you prefer keeping everything on Netlify, you can convert the backend to serverless functions:

1. Create `netlify/functions/auth-google.js`
2. Create `netlify/functions/emails.js`
3. Use Netlify environment variables for secrets
4. Use external database (Supabase, PlanetScale) for tokens

This approach is more complex but keeps everything on one platform.
