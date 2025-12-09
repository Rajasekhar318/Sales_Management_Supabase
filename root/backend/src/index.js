// backend/src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const transactionsRouter = require('./routes/transactions.routes');
const { supabase } = require('./db/pool');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger (dev-friendly)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// API routes
app.use('/api/transactions', transactionsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 4000;
let server = null;

async function start() {
  try {
    // quick probe: head request to transactions table (no rows returned)
    const { error } = await supabase
      .from('transactions')
      .select('id', { head: true, count: 'exact' });

    if (error) {
      // If table doesn't exist or permission issue, we still allow server to start,
      // but log the problem so you can fix it quickly.
      console.warn('Supabase probe warning (table may not exist or permission issue):', error.message || error);
    }

    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log(`Using Supabase project: ${process.env.SUPABASE_URL}`);
    });
  } catch (err) {
    console.error('Failed to start server — Supabase connection error:', err);
    process.exit(1);
  }
}

// Graceful shutdown
function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
