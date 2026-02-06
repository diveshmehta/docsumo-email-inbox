# Docsumo Email Inbox

A production-ready email inbox prototype with real Gmail integration. Connects to your Gmail account, syncs your last 100 emails, and automatically classifies them (BOL, Tender, Lumper Receipt).

## Features

- 🔗 **Gmail OAuth Integration** - Securely connect your Gmail account
- 📧 **Real Email Sync** - Pull last 100 emails with attachments
- 🏷️ **Auto Classification** - Automatically tag emails as BOL, Tender, Lumper Receipt, or Other
- 📊 **Workflow Tracking** - View extraction and case creation workflows
- 🎨 **Docsumo Design System** - Built with Docsumo Storybook components

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run setup
```

### 2. Configure Google OAuth (Required for Gmail Integration)

See [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) for detailed instructions.

**Quick summary:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API
4. Configure OAuth consent screen
5. Create OAuth credentials
6. Copy credentials to `server/.env`

### 3. Run the Application

**Development (with Gmail integration):**

```bash
# Terminal 1: Start backend server
cd server
cp env.example .env  # Then edit with your Google credentials
npm run dev

# Terminal 2: Start frontend
npm run dev
```

Or run both simultaneously:

```bash
npm run dev:all
```

**Demo Mode (no setup required):**

```bash
npm run dev
```

Open http://localhost:5174/inbox and use the demo data.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                      localhost:5174                          │
├─────────────────────────────────────────────────────────────┤
│  • Email Inbox UI with table view                            │
│  • Classification badges & workflow status                   │
│  • Side panel for email details                              │
│  • Toggle between demo data and live Gmail                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express)                         │
│                    localhost:3001                            │
├─────────────────────────────────────────────────────────────┤
│  • Google OAuth 2.0 flow                                     │
│  • Gmail API integration                                     │
│  • Email classification logic                                │
│  • Token management                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Gmail API                               │
│               googleapis.com                                 │
├─────────────────────────────────────────────────────────────┤
│  • Fetch messages with attachments                           │
│  • Read email content                                        │
│  • Access attachment data                                    │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | GET | Get OAuth URL to start authentication |
| `/api/auth/google/callback` | GET | OAuth callback handler |
| `/api/auth/status` | GET | Check connection status |
| `/api/auth/disconnect` | POST | Disconnect Gmail account |
| `/api/emails` | GET | Fetch emails (with classification) |
| `/api/emails/:id` | GET | Get single email details |
| `/api/emails/:id/attachments/:attachmentId` | GET | Get attachment data |

## Classification Logic

Emails are automatically classified based on keywords in the subject, body, and attachment names:

### BOL (Bill of Lading)
Keywords: `bill of lading`, `bol`, `b/l`, `shipment`, `freight`, `carrier`, `consignee`, `shipper`, `pro number`

### Tender
Keywords: `tender`, `bid`, `proposal`, `rfp`, `rfq`, `quotation`, `procurement`, `submission`

### Lumper Receipt
Keywords: `lumper`, `unloading`, `loading fee`, `receipt`, `warehouse`, `dock`, `handling`

## Environment Variables

### Backend (`server/.env`)

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost:5174
PORT=3001
```

### Frontend (`.env` - optional)

```env
VITE_API_URL=http://localhost:3001
```

## Production Deployment

### Security Considerations

1. **Token Storage**: Replace in-memory storage with Redis or encrypted database
2. **Token Refresh**: Implement automatic token refresh for long sessions
3. **Session Management**: Use proper session cookies with httpOnly flag
4. **HTTPS**: Always use HTTPS in production
5. **OAuth Verification**: Submit app for Google verification to remove "unverified" warning

### Deployment Steps

1. Deploy backend to your server (e.g., Railway, Render, AWS)
2. Update OAuth redirect URIs in Google Console
3. Deploy frontend to Netlify/Vercel
4. Update `VITE_API_URL` to point to production backend

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run dev:server` | Start backend development server |
| `npm run dev:all` | Start both frontend and backend |
| `npm run build` | Build frontend for production |
| `npm run setup` | Install all dependencies |

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, googleapis
- **Auth**: Google OAuth 2.0
- **Icons**: Lucide React
- **Dates**: date-fns

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Check that redirect URI matches exactly in Google Console

### "Error 403: access_denied"
- Add your email as a test user in OAuth consent screen

### "Invalid grant"
- Authorization code expired, try OAuth flow again

### Emails not loading
- Check Gmail API is enabled
- Verify scopes in OAuth consent screen
- Check server logs for errors

## License

MIT
