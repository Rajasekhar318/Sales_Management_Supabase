// backend/src/utils/queryBuilder.js
// Builds a parameterized WHERE clause and values array for SQLite.
// Defensive: handles empty strings, numeric zeros, arrays, trims tags, and uses DATE() for date comparisons.

function isProvided(v) {
  return v !== undefined && v !== null && v !== '';
}

function ensureArray(v) {
  if (v === undefined || v === null) return [];
  if (Array.isArray(v)) return v;
  // If comma-separated string, split and trim
  if (typeof v === 'string' && v.includes(',')) return v.split(',').map(s => s.trim()).filter(Boolean);
  return [v];
}

function buildQuery(params = {}) {
  const conditions = [];
  const values = [];

  // full-text search on customer_name (case-insensitive) and phone_number
  if (isProvided(params.q)) {
    const qRaw = String(params.q).trim();
    const qLower = `%${qRaw.toLowerCase()}%`;
    const qRawLike = `%${qRaw}%`; // phone numbers may have + or digits, case not relevant
    conditions.push("(LOWER(customer_name) LIKE ? OR phone_number LIKE ?)");
    values.push(qLower, qRawLike);
  }

  // Generic helper for IN clauses
  function handleIn(fieldName, raw) {
    const arr = ensureArray(raw).map(x => (typeof x === 'string' ? x.trim() : x));
    if (arr.length === 0) return;
    const placeholders = arr.map(() => '?').join(',');
    conditions.push(`${fieldName} IN (${placeholders})`);
    values.push(...arr);
  }

  // Customer Region (multi-select)
  if (isProvided(params.regions)) handleIn('customer_region', params.regions);

  // Gender (multi-select)
  if (isProvided(params.genders)) handleIn('gender', params.genders);

  // Age range (numeric). Accept 0 as valid.
  if (isProvided(params.ageMin)) {
    const n = Number(params.ageMin);
    if (!Number.isNaN(n)) {
      conditions.push(`age >= ?`);
      values.push(n);
    }
  }
  if (isProvided(params.ageMax)) {
    const n = Number(params.ageMax);
    if (!Number.isNaN(n)) {
      conditions.push(`age <= ?`);
      values.push(n);
    }
  }

  // Product Category (multi-select)
  if (isProvided(params.categories)) handleIn('product_category', params.categories);

  // Tags: assume tags column stores comma-separated tags like "tag1,tag2"
  if (isProvided(params.tags)) {
    const arr = ensureArray(params.tags).map(t => String(t).trim()).filter(Boolean);
    if (arr.length) {
      // Use pattern matching on ','||tags||',' LIKE '%,tag,%' to match whole tags
      const tagConds = arr.map(() => "((',' || COALESCE(tags,'') || ',') LIKE ?)").join(' OR ');
      conditions.push(`(${tagConds})`);
      values.push(...arr.map(t => `%,${t},%`));
    }
  }

  // Payment methods (multi-select)
  if (isProvided(params.paymentMethods)) handleIn('payment_method', params.paymentMethods);

  // Date range: use DATE(date) to compare only the date portion (handles datetimes)
  if (isProvided(params.dateFrom)) {
    // Expecting ISO-like YYYY-MM-DD, but we'll still compare using DATE()
    conditions.push(`DATE(date) >= DATE(?)`);
    values.push(String(params.dateFrom));
  }
  if (isProvided(params.dateTo)) {
    conditions.push(`DATE(date) <= DATE(?)`);
    values.push(String(params.dateTo));
  }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  return { where, values };
}

module.exports = { buildQuery };
