// backend/src/seed/importDataset.supabase.js
// Robust CSV importer for Supabase: chunked inserts + retry + backoff
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { supabase } = require('../db/pool');

const CHUNK_SIZE = 200;       // number of rows per insert request (adjustable)
const MAX_RETRIES = 6;        // max retry attempts for a failed batch
const BASE_DELAY_MS = 1000;   // initial backoff delay

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildRecord(row) {
  // Normalize and map CSV headers (flexible for different header names)
  return {
    transaction_id: row["Transaction ID"] || row["transaction_id"] || row["transactionId"] || null,
    date: row["Date"] || row["date"] || null,
    customer_id: row["Customer ID"] || row["customer_id"] || null,
    customer_name: row["Customer Name"] || row["customer_name"] || null,
    phone_number: row["Phone Number"] || row["phone_number"] || null,
    gender: row["Gender"] || row["gender"] || null,
    age: row["Age"] ? Number(row["Age"]) : (row["age"] ? Number(row["age"]) : null),
    customer_region: row["Customer Region"] || row["customer_region"] || null,
    product_id: row["Product ID"] || row["product_id"] || null,
    product_name: row["Product Name"] || row["product_name"] || null,
    product_category: row["Product Category"] || row["product_category"] || null,
    tags: row["Tags"] || row["tags"] || null,
    quantity: row["Quantity"] ? Number(row["Quantity"]) : (row["quantity"] ? Number(row["quantity"]) : 0),
    price_per_unit: row["Price per Unit"] || row["price_per_unit"] ? Number(row["Price per Unit"] || row["price_per_unit"]) : null,
    discount_percentage: row["Discount Percentage"] || row["discount_percentage"] ? Number(row["Discount Percentage"] || row["discount_percentage"]) : null,
    total_amount: row["Total Amount"] || row["total_amount"] ? Number(row["Total Amount"] || row["total_amount"]) : null,
    final_amount: row["Final Amount"] || row["final_amount"] ? Number(row["Final Amount"] || row["final_amount"]) : null,
    payment_method: row["Payment Method"] || row["payment_method"] || null,
    order_status: row["Order Status"] || row["order_status"] || null,
    delivery_type: row["Delivery Type"] || row["delivery_type"] || null,
    store_id: row["Store ID"] || row["store_id"] || null,
    store_location: row["Store Location"] || row["store_location"] || null,
    salesperson_id: row["Salesperson ID"] || row["salesperson_id"] || null,
    employee_name: row["Employee Name"] || row["employee_name"] || null
  };
}

async function insertChunkWithRetry(chunk, chunkIndex) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(chunk, { returning: 'minimal' });

      if (error) {
        // Supabase returns error object for logical errors
        console.error(`Chunk ${chunkIndex} attempt ${attempt} - Supabase returned error:`, error.message || error);
        // Some errors are permanent (schema mismatch). If it's a network-like error, retry.
        // We'll retry regardless up to MAX_RETRIES to be resilient to transient issues.
      } else {
        // Success
        return { success: true, inserted: chunk.length };
      }
    } catch (err) {
      // Network / fetch / unexpected exceptions
      console.error(`Chunk ${chunkIndex} attempt ${attempt} - Exception:`, err && err.message ? err.message : err);
    }

    // Backoff before next retry
    const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
    console.log(`Chunk ${chunkIndex} - retrying in ${delay} ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
    await sleep(delay);
  }

  // If we reached here, all retries failed
  return { success: false, inserted: 0 };
}

async function importCSV() {
  const filePath = path.join(__dirname, 'dataset.csv');

  if (!fs.existsSync(filePath)) {
    console.error("❌ dataset.csv not found in /src/seed folder");
    process.exit(1);
  }

  console.log("📥 Starting CSV import into Supabase...");
  console.log(`📄 Reading file: ${filePath}`);

  const rows = [];
  const readStream = fs.createReadStream(filePath).pipe(csv());

  for await (const rawRow of readStream) {
    const rec = buildRecord(rawRow);
    rows.push(rec);
  }

  console.log(`✅ Parsed ${rows.length} rows from CSV.`);

  // Chunk rows to reduce number of HTTP calls and avoid per-row failures
  const chunks = [];
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    chunks.push(rows.slice(i, i + CHUNK_SIZE));
  }

  console.log(`🔁 Uploading in ${chunks.length} chunk(s) (chunk size ${CHUNK_SIZE}).`);

  let totalInserted = 0;
  let failedChunks = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const idx = i + 1;
    console.log(`Uploading chunk ${idx}/${chunks.length} (${chunk.length} rows)...`);

    const res = await insertChunkWithRetry(chunk, idx);
    if (res.success) {
      totalInserted += res.inserted;
      console.log(`Chunk ${idx} uploaded successfully (inserted ${res.inserted}). Total so far: ${totalInserted}`);
    } else {
      failedChunks++;
      console.error(`⚠️ Chunk ${idx} FAILED after ${MAX_RETRIES} attempts. Skipping this chunk.`);
      // Optionally: write failed chunk to a file for manual retry
      try {
        const failPath = path.join(__dirname, `failed-chunk-${idx}.json`);
        fs.writeFileSync(failPath, JSON.stringify(chunk, null, 2));
        console.log(`Wrote failed chunk to ${failPath}`);
      } catch (writeErr) {
        console.error('Failed to write failed chunk file:', writeErr && writeErr.message ? writeErr.message : writeErr);
      }
    }
  }

  console.log(`\n✔ Import finished. Inserted rows: ${totalInserted}. Failed chunks: ${failedChunks} (${failedChunks * CHUNK_SIZE} rows approx).`);
  if (failedChunks > 0) {
    console.warn('Some chunks failed and were saved as failed-chunk-<n>.json in the seed folder.');
    console.warn('You can retry them individually after checking network/permissions.');
  }

  process.exit(0);
}

importCSV().catch(err => {
  console.error('Fatal import error:', err && err.message ? err.message : err);
  process.exit(1);
});
