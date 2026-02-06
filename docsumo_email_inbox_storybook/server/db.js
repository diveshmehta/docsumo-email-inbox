/**
 * Database Module for Token Storage
 * Supports both PostgreSQL (production) and in-memory (development)
 */

import pg from 'pg';
const { Pool } = pg;

// In-memory fallback for development
const memoryStore = new Map();

// PostgreSQL pool (only created if DATABASE_URL exists)
let pool = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

/**
 * Initialize database tables
 */
export async function initDB() {
  if (!pool) {
    console.log('📦 Using in-memory token storage (development mode)');
    return;
  }

  try {
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS synced_emails (
        id VARCHAR(255) PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        thread_id VARCHAR(255),
        subject TEXT,
        from_email VARCHAR(255),
        from_name VARCHAR(255),
        received_at TIMESTAMP,
        classification JSONB,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_email) REFERENCES oauth_tokens(email) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_synced_emails_user ON synced_emails(user_email)
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

/**
 * Save OAuth tokens
 */
export async function saveToken(email, tokens, userInfo) {
  if (!pool) {
    // In-memory storage
    memoryStore.set(email, {
      tokens,
      userInfo,
      connectedAt: new Date().toISOString(),
    });
    return;
  }

  await pool.query(
    `INSERT INTO oauth_tokens (email, access_token, refresh_token, expiry_date, user_info, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (email) DO UPDATE SET
       access_token = $2,
       refresh_token = COALESCE($3, oauth_tokens.refresh_token),
       expiry_date = $4,
       user_info = $5,
       updated_at = NOW()`,
    [
      email,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expiry_date,
      JSON.stringify(userInfo),
    ]
  );
}

/**
 * Get OAuth tokens for a user
 */
export async function getToken(email) {
  if (!pool) {
    return memoryStore.get(email) || null;
  }

  const result = await pool.query(
    'SELECT * FROM oauth_tokens WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    tokens: {
      access_token: row.access_token,
      refresh_token: row.refresh_token,
      expiry_date: row.expiry_date,
    },
    userInfo: row.user_info,
    connectedAt: row.created_at,
  };
}

/**
 * Delete OAuth tokens
 */
export async function deleteToken(email) {
  if (!pool) {
    memoryStore.delete(email);
    return;
  }

  await pool.query('DELETE FROM oauth_tokens WHERE email = $1', [email]);
}

/**
 * Check if a user is connected
 */
export async function isConnected(email) {
  const token = await getToken(email);
  return token !== null;
}

/**
 * Get all connected users (admin)
 */
export async function getAllConnectedUsers() {
  if (!pool) {
    return Array.from(memoryStore.entries()).map(([email, data]) => ({
      email,
      ...data.userInfo,
      connectedAt: data.connectedAt,
    }));
  }

  const result = await pool.query(
    'SELECT email, user_info, created_at FROM oauth_tokens ORDER BY created_at DESC'
  );

  return result.rows.map((row) => ({
    email: row.email,
    ...row.user_info,
    connectedAt: row.created_at,
  }));
}

export default pool;
