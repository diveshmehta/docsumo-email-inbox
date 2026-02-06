/**
 * Docsumo Email Inbox - Backend Server
 * Handles Google OAuth 2.0 and Gmail API integration
 */

import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Google OAuth Configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'
);

// Gmail API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// In-memory token storage (use Redis/DB in production)
const tokenStore = new Map();

// ============================================
// Auth Endpoints
// ============================================

// Generate OAuth URL
app.get('/api/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent to get refresh token
  });
  res.json({ authUrl });
});

// OAuth Callback
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/inbox?error=no_code`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    
    // Store tokens (use user email as key)
    tokenStore.set(userInfo.email, {
      tokens,
      userInfo,
      connectedAt: new Date().toISOString(),
    });

    // Redirect back to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/inbox?connected=true&email=${encodeURIComponent(userInfo.email)}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/inbox?error=auth_failed`);
  }
});

// Check connection status
app.get('/api/auth/status', (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    return res.json({ connected: false });
  }

  const stored = tokenStore.get(email);
  if (stored) {
    return res.json({
      connected: true,
      email: stored.userInfo.email,
      name: stored.userInfo.name,
      picture: stored.userInfo.picture,
      connectedAt: stored.connectedAt,
    });
  }

  res.json({ connected: false });
});

// Disconnect account
app.post('/api/auth/disconnect', (req, res) => {
  const { email } = req.body;
  
  if (email && tokenStore.has(email)) {
    tokenStore.delete(email);
    return res.json({ success: true });
  }

  res.json({ success: false, error: 'Account not found' });
});

// ============================================
// Gmail Endpoints
// ============================================

// Helper: Get authenticated Gmail client
const getGmailClient = (email) => {
  const stored = tokenStore.get(email);
  if (!stored) {
    throw new Error('Not authenticated');
  }

  const authClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  authClient.setCredentials(stored.tokens);

  return google.gmail({ version: 'v1', auth: authClient });
};

// Fetch emails
app.get('/api/emails', async (req, res) => {
  const { email, maxResults = 100 } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const gmail = getGmailClient(email);

    // Get list of messages
    const { data: listData } = await gmail.users.messages.list({
      userId: 'me',
      maxResults: parseInt(maxResults),
      q: 'has:attachment', // Focus on emails with attachments
    });

    if (!listData.messages || listData.messages.length === 0) {
      return res.json({ emails: [], total: 0 });
    }

    // Fetch full message details
    const emails = await Promise.all(
      listData.messages.map(async (msg) => {
        try {
          const { data: message } = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
            format: 'full',
          });
          return parseGmailMessage(message);
        } catch (err) {
          console.error(`Error fetching message ${msg.id}:`, err.message);
          return null;
        }
      })
    );

    // Filter out failed fetches and classify
    const validEmails = emails.filter(Boolean).map(classifyEmail);

    res.json({
      emails: validEmails,
      total: validEmails.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
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
    const gmail = getGmailClient(email);

    const { data: message } = await gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'full',
    });

    const parsedEmail = parseGmailMessage(message);
    const classifiedEmail = classifyEmail(parsedEmail);

    res.json(classifiedEmail);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get attachment
app.get('/api/emails/:messageId/attachments/:attachmentId', async (req, res) => {
  const { email } = req.query;
  const { messageId, attachmentId } = req.params;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const gmail = getGmailClient(email);

    const { data: attachment } = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId,
      id: attachmentId,
    });

    res.json({
      data: attachment.data,
      size: attachment.size,
    });
  } catch (error) {
    console.error('Error fetching attachment:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Helper Functions
// ============================================

// Parse Gmail message into our format
function parseGmailMessage(message) {
  const headers = message.payload.headers;
  const getHeader = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

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
    to: getHeader('To').split(',').map(e => e.trim()),
    cc: getHeader('Cc') ? getHeader('Cc').split(',').map(e => e.trim()) : [],
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
  const attachmentNames = email.attachments.map(a => a.filename.toLowerCase()).join(' ');
  const content = `${subject} ${body} ${attachmentNames}`;

  let classification = null;
  let confidence = 0;

  // BOL Detection
  const bolKeywords = ['bill of lading', 'bol', 'b/l', 'shipment', 'freight', 'carrier', 'consignee', 'shipper', 'pro number'];
  const bolScore = bolKeywords.filter(kw => content.includes(kw)).length;
  if (bolScore >= 2) {
    classification = { documentType: 'BOL', confidence: Math.min(0.6 + bolScore * 0.08, 0.98) };
  }

  // Tender Detection
  const tenderKeywords = ['tender', 'bid', 'proposal', 'rfp', 'rfq', 'quotation', 'procurement', 'submission'];
  const tenderScore = tenderKeywords.filter(kw => content.includes(kw)).length;
  if (tenderScore >= 2 && (!classification || tenderScore > bolScore)) {
    classification = { documentType: 'Tender', confidence: Math.min(0.6 + tenderScore * 0.08, 0.98) };
  }

  // Lumper Receipt Detection
  const lumperKeywords = ['lumper', 'unloading', 'loading fee', 'receipt', 'warehouse', 'dock', 'handling'];
  const lumperScore = lumperKeywords.filter(kw => content.includes(kw)).length;
  if (lumperScore >= 2 && (!classification || lumperScore > Math.max(bolScore, tenderScore))) {
    classification = { documentType: 'LumperReceipt', confidence: Math.min(0.6 + lumperScore * 0.08, 0.98) };
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
    email.attachments = email.attachments.map(att => ({
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

app.listen(PORT, () => {
  console.log(`\n🚀 Docsumo Email Server running on http://localhost:${PORT}`);
  console.log(`\n📋 Endpoints:`);
  console.log(`   GET  /api/auth/google          - Get OAuth URL`);
  console.log(`   GET  /api/auth/google/callback - OAuth callback`);
  console.log(`   GET  /api/auth/status          - Check connection status`);
  console.log(`   POST /api/auth/disconnect      - Disconnect account`);
  console.log(`   GET  /api/emails               - Fetch emails`);
  console.log(`   GET  /api/emails/:id           - Get single email`);
  console.log(`\n⚠️  Make sure to set up your .env file with Google OAuth credentials`);
});
