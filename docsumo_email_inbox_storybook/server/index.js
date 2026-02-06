/**
 * Docsumo Email Inbox - Backend Server
 * Production-ready with database storage and security
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { initDB, saveToken, getToken, deleteToken } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// ============================================
// Middleware
// ============================================

// Security headers (production)
if (isProduction) {
  app.use(helmet());
}

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // Limit requests per IP
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = isProduction
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : [
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:3000',
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ============================================
// Google OAuth Configuration
// ============================================

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || `http://localhost:${PORT}/api/auth/google/callback`
);

// Gmail API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Frontend URL for redirects
const getFrontendURL = () => {
  return process.env.FRONTEND_URL || 'http://localhost:5174';
};

// ============================================
// Health Check
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Docsumo Email Inbox API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth/google',
      emails: '/api/emails',
      health: '/health',
    },
  });
});

// ============================================
// Auth Endpoints
// ============================================

// Generate OAuth URL
app.get('/api/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.json({ authUrl });
});

// OAuth Callback
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const frontendURL = getFrontendURL();

  if (!code) {
    return res.redirect(`${frontendURL}/inbox?error=no_code`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Save tokens to database
    await saveToken(userInfo.email, tokens, userInfo);

    console.log(`✅ User connected: ${userInfo.email}`);

    // Redirect back to frontend with success
    res.redirect(`${frontendURL}/inbox?connected=true&email=${encodeURIComponent(userInfo.email)}`);
  } catch (error) {
    console.error('OAuth callback error:', error.message);
    res.redirect(`${frontendURL}/inbox?error=auth_failed`);
  }
});

// Check connection status
app.get('/api/auth/status', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.json({ connected: false });
  }

  try {
    const stored = await getToken(email);
    if (stored) {
      return res.json({
        connected: true,
        email: stored.userInfo.email,
        name: stored.userInfo.name,
        picture: stored.userInfo.picture,
        connectedAt: stored.connectedAt,
      });
    }
  } catch (error) {
    console.error('Status check error:', error.message);
  }

  res.json({ connected: false });
});

// Disconnect account
app.post('/api/auth/disconnect', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, error: 'Email required' });
  }

  try {
    await deleteToken(email);
    console.log(`🔌 User disconnected: ${email}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Disconnect error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

// ============================================
// Gmail Endpoints
// ============================================

// Helper: Get authenticated Gmail client
const getGmailClient = async (email) => {
  const stored = await getToken(email);
  if (!stored) {
    throw new Error('Not authenticated');
  }

  const authClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  authClient.setCredentials(stored.tokens);

  // Check if token needs refresh
  if (stored.tokens.expiry_date && stored.tokens.expiry_date < Date.now()) {
    try {
      const { credentials } = await authClient.refreshAccessToken();
      await saveToken(email, credentials, stored.userInfo);
      authClient.setCredentials(credentials);
      console.log(`🔄 Token refreshed for: ${email}`);
    } catch (error) {
      console.error('Token refresh failed:', error.message);
      await deleteToken(email);
      throw new Error('Token expired, please reconnect');
    }
  }

  return google.gmail({ version: 'v1', auth: authClient });
};

// Fetch emails
app.get('/api/emails', async (req, res) => {
  const { email, maxResults = 10 } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const gmail = await getGmailClient(email);

    // Get list of messages
    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: parseInt(maxResults),
    });

    if (!listData.messages || listData.messages.length === 0) {
      return res.json({ emails: [], total: 0 });
    }

    // Fetch full message details (limit concurrent requests)
    const emails = [];
    for (const msg of listData.messages) {
      try {
        const { data: message } = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });
        const parsed = parseGmailMessage(message);
        const classified = classifyEmail(parsed);
        emails.push(classified);
      } catch (err) {
        console.error(`Error fetching message ${msg.id}:`, err.message);
      }
    }

    res.json({
      emails,
      total: emails.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Sync specific email
app.get('/api/emails/:id', async (req, res) => {
  const { email } = req.query;
  const { id } = req.params;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const gmail = await getGmailClient(email);

    const { data: message } = await gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'full',
    });

    const parsedEmail = parseGmailMessage(message);
    const classifiedEmail = classifyEmail(parsedEmail);

    res.json(classifiedEmail);
  } catch (error) {
    console.error('Error fetching email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Helper Functions
// ============================================

// Parse Gmail message into our format
function parseGmailMessage(message) {
  const headers = message.payload.headers;
  const getHeader = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  // Parse email addresses
  const parseAddress = (str) => {
    const match = str.match(/(?:"?([^"]*)"?\s)?(?:<)?([^<>]+@[^<>]+)(?:>)?/);
    if (match) {
      return { name: match[1] || match[2].split('@')[0], email: match[2] };
    }
    return { name: str, email: str };
  };

  // Get body content
  const getBody = (payload) => {
    let text = '';
    let html = '';

    if (payload.body?.data) {
      const decoded = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      if (payload.mimeType === 'text/html') {
        html = decoded;
      } else {
        text = decoded;
      }
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          text = Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.mimeType === 'text/html' && part.body?.data) {
          html = Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.parts) {
          const nested = getBody(part);
          text = text || nested.text;
          html = html || nested.html;
        }
      }
    }

    return { text, html };
  };

  // Get attachments
  const getAttachments = (payload, messageId) => {
    const attachments = [];

    const processPartForAttachments = (part) => {
      if (part.filename && part.body?.attachmentId) {
        attachments.push({
          id: part.body.attachmentId,
          messageId,
          filename: part.filename,
          mimeType: part.mimeType,
          size: part.body.size || 0,
        });
      }
      if (part.parts) {
        part.parts.forEach(processPartForAttachments);
      }
    };

    if (payload.parts) {
      payload.parts.forEach(processPartForAttachments);
    }

    return attachments;
  };

  const from = parseAddress(getHeader('From'));
  const body = getBody(message.payload);
  const attachments = getAttachments(message.payload, message.id);

  return {
    id: message.id,
    threadId: message.threadId,
    from,
    to: getHeader('To')
      .split(',')
      .map((e) => e.trim()),
    cc: getHeader('Cc')
      ? getHeader('Cc')
          .split(',')
          .map((e) => e.trim())
      : [],
    subject: getHeader('Subject'),
    body,
    receivedAt: new Date(parseInt(message.internalDate)).toISOString(),
    attachments,
    labels: message.labelIds || [],
    snippet: message.snippet,
    status: message.labelIds?.includes('UNREAD') ? 'unread' : 'read',
  };
}

// Classify email based on content and attachments
function classifyEmail(email) {
  const subject = email.subject.toLowerCase();
  const body = email.body.text.toLowerCase();
  const attachmentNames = email.attachments.map((a) => a.filename.toLowerCase()).join(' ');
  const content = `${subject} ${body} ${attachmentNames}`;

  let classification = null;

  // BOL Detection
  const bolKeywords = [
    'bill of lading',
    'bol',
    'b/l',
    'shipment',
    'freight',
    'carrier',
    'consignee',
    'shipper',
    'pro number',
  ];
  const bolScore = bolKeywords.filter((kw) => content.includes(kw)).length;
  if (bolScore >= 2) {
    classification = {
      documentType: 'BOL',
      confidence: Math.min(0.6 + bolScore * 0.08, 0.98),
    };
  }

  // Tender Detection
  const tenderKeywords = [
    'tender',
    'bid',
    'proposal',
    'rfp',
    'rfq',
    'quotation',
    'procurement',
    'submission',
  ];
  const tenderScore = tenderKeywords.filter((kw) => content.includes(kw)).length;
  if (tenderScore >= 2 && (!classification || tenderScore > bolScore)) {
    classification = {
      documentType: 'Tender',
      confidence: Math.min(0.6 + tenderScore * 0.08, 0.98),
    };
  }

  // Lumper Receipt Detection
  const lumperKeywords = [
    'lumper',
    'unloading',
    'loading fee',
    'receipt',
    'warehouse',
    'dock',
    'handling',
  ];
  const lumperScore = lumperKeywords.filter((kw) => content.includes(kw)).length;
  if (lumperScore >= 2 && (!classification || lumperScore > Math.max(bolScore, tenderScore))) {
    classification = {
      documentType: 'LumperReceipt',
      confidence: Math.min(0.6 + lumperScore * 0.08, 0.98),
    };
  }

  // Default to Other if has attachments but no classification
  if (!classification && email.attachments.length > 0) {
    classification = { documentType: 'Other', confidence: 0.5 };
  }

  // Add classification to email
  if (classification) {
    email.classification = {
      ...classification,
      classifiedAt: new Date().toISOString(),
      classifiedBy: 'system',
    };

    // Classify individual attachments
    email.attachments = email.attachments.map((att) => ({
      ...att,
      documentType: classification.documentType,
      confidence: classification.confidence * 0.95,
    }));
  }

  return email;
}

// ============================================
// Start Server
// ============================================

async function startServer() {
  try {
    // Initialize database
    await initDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 Docsumo Email Server running on http://localhost:${PORT}`);
      console.log(`📍 Environment: ${isProduction ? 'production' : 'development'}`);
      console.log(`\n📋 Endpoints:`);
      console.log(`   GET  /health                 - Health check`);
      console.log(`   GET  /api/auth/google        - Get OAuth URL`);
      console.log(`   GET  /api/auth/google/callback - OAuth callback`);
      console.log(`   GET  /api/auth/status        - Check connection status`);
      console.log(`   POST /api/auth/disconnect    - Disconnect account`);
      console.log(`   GET  /api/emails             - Fetch emails`);
      console.log(`   GET  /api/emails/:id         - Get single email`);

      if (!process.env.GOOGLE_CLIENT_ID) {
        console.log(`\n⚠️  GOOGLE_CLIENT_ID not set - OAuth will not work`);
      }
      if (!process.env.DATABASE_URL) {
        console.log(`\n⚠️  DATABASE_URL not set - using in-memory storage`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
