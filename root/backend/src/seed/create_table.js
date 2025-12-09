// backend/src/seed/create_table.js
// Run this with: node src/seed/create_table.js
// It reads DATABASE_URL from .env and executes the CREATE TABLE SQL.

const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const DATABASE_URL = (process.env.DATABASE_URL || '').trim();

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in environment. Add DATABASE_URL to your .env (from Supabase dashboard).');
  process.exit(1);
}

const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.transactions (
  id bigserial PRIMARY KEY,
  transaction_id text,
  date timestamptz,
  customer_id text,
  customer_name text,
  phone_number text,
  gender text,
  age integer,
  customer_region text,
  product_id text,
  product_name text,
  product_category text,
  tags text,
  quantity integer,
  price_per_unit numeric,
  discount_percentage numeric,
  total_amount numeric,
  final_amount numeric,
  payment_method text,
  order_status text,
  delivery_type text,
  store_id text,
  store_location text,
  salesperson_id text,
  employee_name text
);
`;

async function run() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected to database. Creating table (if not exists)...');
    await client.query(createTableSQL);
    console.log('✅ Table `transactions` created (or already existed).');
  } catch (err) {
    console.error('❌ Error creating table:', err && err.message ? err.message : err);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
