// frontend/src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const api = axios.create({ baseURL });

/**
 * Build query string such that arrays are repeated params:
 * e.g. regions=North&regions=South
 */
function buildSearchParams(params = {}) {
  const sp = new URLSearchParams();

  for (const key of Object.keys(params)) {
    const val = params[key];
    if (val === undefined || val === null || val === '') continue;

    if (Array.isArray(val)) {
      for (const v of val) {
        if (v !== undefined && v !== null && v !== '') sp.append(key, v);
      }
    } else {
      sp.append(key, String(val));
    }
  }
  return sp.toString();
}

export async function fetchTransactions(params = {}) {
  const qs = buildSearchParams(params);
  const url = `/transactions${qs ? `?${qs}` : ''}`;
  const resp = await api.get(url);
  return resp.data;
}
