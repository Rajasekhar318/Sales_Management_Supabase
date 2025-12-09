// backend/src/services/transactions.service.js
const { supabase } = require('../db/pool');

/**
 * Helper: ensure an array from param similar to old utils.ensureArray
 */
function ensureArray(v) {
  if (v === undefined || v === null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.includes(',')) return v.split(',').map(s => s.trim()).filter(Boolean);
  return [v];
}

function normalizeRow(r) {
  return {
    ...r,
    quantity: r.quantity === null || r.quantity === undefined ? 0 : Number(r.quantity),
    age: r.age === null || r.age === undefined ? null : (Number(r.age) || null),
    total_amount: r.total_amount === null || r.total_amount === undefined ? 0 : Number(r.total_amount),
    final_amount: r.final_amount === null || r.final_amount === undefined ? 0 : Number(r.final_amount),
    tags: typeof r.tags === 'string' ? r.tags.split(',').map(t => t.trim()).filter(Boolean).join(',') : ''
  };
}

async function listTransactions(params = {}) {
  // normalize page & pageSize
  const page = Math.max(1, parseInt(params.page || 1, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(params.pageSize || 10, 10) || 10));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Start query
  // select all columns and request exact count
  let qb = supabase
    .from('transactions')
    .select('*', { count: 'exact' });

  // Full-text-ish search on customer_name (case-insensitive) or phone_number
  if (params.q) {
    const qRaw = String(params.q).trim();
    qb = qb.or(`customer_name.ilike.%${qRaw}%,phone_number.ilike.%${qRaw}%`);
  }

  // Regions
  if (params.regions) {
    const arr = ensureArray(params.regions);
    if (arr.length) qb = qb.in('customer_region', arr);
  }

  // Genders
  if (params.genders) {
    const arr = ensureArray(params.genders);
    if (arr.length) qb = qb.in('gender', arr);
  }

  // Age range
  if (params.ageMin !== undefined && params.ageMin !== null && params.ageMin !== '') {
    const n = Number(params.ageMin);
    if (!Number.isNaN(n)) qb = qb.gte('age', n);
  }
  if (params.ageMax !== undefined && params.ageMax !== null && params.ageMax !== '') {
    const n = Number(params.ageMax);
    if (!Number.isNaN(n)) qb = qb.lte('age', n);
  }

  // Categories
  if (params.categories) {
    const arr = ensureArray(params.categories);
    if (arr.length) qb = qb.in('product_category', arr);
  }

  // Tags: use ilike to find tag substring (assumes comma-separated)
  if (params.tags) {
    const arr = ensureArray(params.tags).map(t => String(t).trim()).filter(Boolean);
    if (arr.length) {
      // build OR chain
      const tagOrs = arr.map(t => `tags.ilike.%${t}%`).join(',');
      qb = qb.or(tagOrs);
    }
  }

  // Payment methods
  if (params.paymentMethods) {
    const arr = ensureArray(params.paymentMethods);
    if (arr.length) qb = qb.in('payment_method', arr);
  }

  // Date range (assumes date stored in ISO or comparable string)
  if (params.dateFrom) qb = qb.gte('date', params.dateFrom);
  if (params.dateTo) qb = qb.lte('date', params.dateTo);

  // Sorting
  let sortBy = 'date';
  let ascending = false; // default DESC
  if (params.sortBy) {
    if (params.sortBy === 'customerName') sortBy = 'customer_name';
    else if (params.sortBy === 'quantity') sortBy = 'quantity';
    else if (params.sortBy === 'date') sortBy = 'date';
  }
  if (params.sortOrder === 'asc') ascending = true;
  qb = qb.order(sortBy, { ascending });

  // Pagination with range()
  qb = qb.range(from, to);

  // Execute
  const { data, error, count } = await qb;

  if (error) {
    console.error('Supabase listTransactions error:', error, { params, from, to });
    throw error;
  }

  const normalizedRows = (data || []).map(normalizeRow);

  return {
    data: normalizedRows,
    meta: {
      total: typeof count === 'number' ? count : (normalizedRows.length),
      page,
      pageSize,
      totalPages: typeof count === 'number' ? Math.ceil(count / pageSize) : Math.ceil(normalizedRows.length / pageSize)
    }
  };
}

module.exports = { listTransactions };
