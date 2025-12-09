// backend/src/db/pool.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

function maskKey(k) {
  if (!k) return '';
  if (k.length <= 10) return '*****';
  return k.slice(0, 4) + '...' + k.slice(-4);
}

const rawUrl = (process.env.SUPABASE_URL || '').trim();
const rawKey = (process.env.SUPABASE_KEY || '').trim();

if (!rawUrl) {
  console.error('Missing SUPABASE_URL in environment. Please add a line to your .env like: SUPABASE_URL=https://your-project.supabase.co');
  process.exit(1);
}
if (!rawKey) {
  console.error('Missing SUPABASE_KEY in environment. Please add SUPABASE_KEY to .env (use service_role key for server-side scripts).');
  process.exit(1);
}

// Simple validation: must start with https:// and contain .supabase.co
if (!/^https:\/\/[A-Za-z0-9.-]+\.supabase\.co\/?$/.test(rawUrl)) {
  console.error('Invalid SUPABASE_URL format:', rawUrl);
  console.error('It must look like: https://your-project-ref.supabase.co (no extra path, no angle brackets).');
  process.exit(1);
}

// Normalize: remove trailing slash if present
const SUPABASE_URL = rawUrl.replace(/\/+$/, '');
const SUPABASE_KEY = rawKey;

console.log(`Using SUPABASE_URL=${SUPABASE_URL}`);
console.log(`Using SUPABASE_KEY=${maskKey(SUPABASE_KEY)}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = { supabase };
