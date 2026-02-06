# Google Gmail API Setup Guide

Follow these steps to enable Gmail integration for your Docsumo Email Inbox.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `Docsumo Email Inbox`
4. Click **Create**

## Step 2: Enable Gmail API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **"Gmail API"**
3. Click on it and press **Enable**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (for testing) or **Internal** (for G Suite)
3. Fill in the required fields:
   - **App name**: `Docsumo Email Inbox`
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.labels`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
6. Add test users (your Gmail address)
7. Click **Save and Continue**

## Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Web application**
4. Name: `Docsumo Email Inbox Web Client`
5. Add **Authorized JavaScript origins**:
   - `http://localhost:3001`
   - `http://localhost:5174`
6. Add **Authorized redirect URIs**:
   - `http://localhost:3001/api/auth/google/callback`
7. Click **Create**
8. Copy your **Client ID** and **Client Secret**

## Step 5: Configure Environment Variables

1. Navigate to the server directory:
   ```bash
   cd docsumo_email_inbox_storybook/server
   ```

2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your credentials:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
   FRONTEND_URL=http://localhost:5174
   PORT=3001
   ```

## Step 6: Run the Application

1. **Start the backend server:**
   ```bash
   cd docsumo_email_inbox_storybook/server
   npm install
   npm run dev
   ```

2. **Start the frontend (in another terminal):**
   ```bash
   cd docsumo_email_inbox_storybook
   npm run dev
   ```

3. **Open the app:**
   - Go to http://localhost:5174/inbox
   - Click "Connect Gmail"
   - Authenticate with your Google account
   - Your last 100 emails will be synced and classified!

## Production Deployment

For production:

1. **Update OAuth credentials** with your production URLs
2. **Use a database** instead of in-memory token storage (Redis, PostgreSQL)
3. **Add token refresh logic** for long-running sessions
4. **Implement proper session management**
5. **Store tokens encrypted** using a service like Google Secret Manager
6. **Submit your OAuth app for verification** to remove the "unverified app" warning

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Check that your redirect URI matches exactly in Google Console

### "Error 403: access_denied"
- Make sure your email is added as a test user in OAuth consent screen

### "Invalid grant"
- The authorization code expired. Try the OAuth flow again.

### Emails not loading
- Check that Gmail API is enabled
- Verify the scopes match in your OAuth consent screen
