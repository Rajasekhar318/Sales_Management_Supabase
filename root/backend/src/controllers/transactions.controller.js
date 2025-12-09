// backend/src/controllers/transactions.controller.js
const { listTransactions } = require('../services/transactions.service');

function sanitizeQuery(q) {
  // The frontend can send repeated params (arrays) or single values.
  // Convert query strings 'true'/'false' or numbers as needed later in services.
  return q;
}

async function getTransactions(req, res) {
  try {
    const params = sanitizeQuery(req.query || {});
    const result = await listTransactions(params);
    res.json(result);
  } catch (err) {
    console.error('getTransactions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getTransactions };
