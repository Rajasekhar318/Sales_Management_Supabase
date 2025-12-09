// frontend/src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import SearchBar from './components/SearchBar';
import FiltersPanel from './components/FiltersPanel';
import StatsCards from './components/StatsCards';
import TransactionsTable from './components/TransactionsTable';
import Pagination from './components/Pagination';
import SortDropdown from './components/SortDropdown';

// Static options moved outside component to keep stable reference
const OPTIONS = {
  regions: ['North', 'South', 'East', 'West'],
  genders: ['Male', 'Female', 'Other'],
  categories: ['Clothing', 'Footwear', 'Electronics'],
  tags: ['sale', 'new', 'popular'],
  paymentMethods: ['Card', 'UPI', 'Cash']
};

export default function App() {
  // initial filter keys (multi-selects are arrays)
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    sortBy: 'date',
    sortOrder: 'desc',
    q: ''
  });

  const [data, setData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);

  // debounce timer + lastQuery guard + abort controller ref
  const debounceRef = useRef(null);
  const lastQueryRef = useRef('');
  const abortRef = useRef(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // Debounce 300ms to coalesce rapid changes
    debounceRef.current = setTimeout(() => {
      (async () => {
        try {
          // Build a canonical string representing the important parts of filters
          const canonical = JSON.stringify({
            q: filters.q || '',
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
            sortBy: filters.sortBy || '',
            sortOrder: filters.sortOrder || '',
            regions: (filters.regions || []).slice().sort(),
            genders: (filters.genders || []).slice().sort(),
            categories: (filters.categories || []).slice().sort(),
            tags: (filters.tags || []).slice().sort(),
            paymentMethods: (filters.paymentMethods || []).slice().sort(),
            ageMin: filters.ageMin || '',
            ageMax: filters.ageMax || '',
            dateFrom: filters.dateFrom || '',
            dateTo: filters.dateTo || ''
          });

          // If the canonical query is identical to the previous one, skip fetch
          if (lastQueryRef.current === canonical) return;
          lastQueryRef.current = canonical;

          // Cancel previous inflight request if any
          if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
          }
          const controller = new AbortController();
          abortRef.current = controller;

          setLoading(true);
          console.debug('Fetching transactions with filters:', filters);

          // Build query string (arrays as repeated params)
          const buildSearchParams = (params = {}) => {
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
          };

          const params = {
            q: filters.q,
            page: filters.page,
            pageSize: filters.pageSize,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            regions: filters.regions,
            genders: filters.genders,
            categories: filters.categories,
            tags: filters.tags,
            paymentMethods: filters.paymentMethods,
            ageMin: filters.ageMin,
            ageMax: filters.ageMax,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo
          };

          const qs = buildSearchParams(params);
          const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
          const url = `${base}/transactions${qs ? `?${qs}` : ''}`;

          const resp = await fetch(url, { signal: controller.signal });
          if (!resp.ok) {
            console.error('Fetch failed', resp.status, await resp.text());
            setLoading(false);
            return;
          }
          const json = await resp.json();
          console.debug('Fetch result meta:', json.meta || {}, 'rows:', (json.data || []).length);

          if (!controller.signal.aborted) {
            setData({ data: json.data || [], meta: json.meta || { total: 0, page: filters.page, pageSize: filters.pageSize } });
          }
        } catch (err) {
          if (err.name === 'AbortError') {
            console.debug('Fetch aborted (stale)');
          } else {
            console.error('Fetch error:', err);
          }
        } finally {
          setLoading(false);
        }
      })();
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [filters]);

  // sort handler
  const setSort = (sortBy, sortOrder) => {
    setFilters(f => ({ ...f, sortBy, sortOrder, page: 1 }));
  };

  // Sidebar markup – enhanced styling with gradients and hover effects
  const Sidebar = () => (
    <aside className="w-64 bg-linear-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm">
      <div className="p-4 flex items-center gap-3 border-b border-slate-200 bg-white">
        <div className="w-10 h-10 bg-linear-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-md transform transition-transform hover:scale-105">
          RD
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">Sales Record</div>
          <div className="text-xs text-slate-500">Rajasekhar Dronamraju</div>
        </div>
      </div>

      <nav className="p-3">
        <ul className="space-y-1 text-sm">
          <li className="px-3 py-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 font-medium text-slate-700 hover:text-slate-900 hover:shadow-sm">
            Dashboard
          </li>
          <li className="px-3 py-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 font-medium text-slate-700 hover:text-slate-900 hover:shadow-sm">
            Nexus
          </li>
          <li className="px-3 py-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 font-medium text-slate-700 hover:text-slate-900 hover:shadow-sm">
            Intake
          </li>

          <li className="mt-4 mb-2 text-xs text-slate-500 uppercase px-3 font-semibold tracking-wider">Services</li>
          <ul className="space-y-1">
            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 text-slate-600 hover:text-slate-900 hover:pl-4">
              Pre-active
            </li>
            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 text-slate-600 hover:text-slate-900 hover:pl-4">
              Active
            </li>
            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 text-slate-600 hover:text-slate-900 hover:pl-4">
              Blocked
            </li>
            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 text-slate-600 hover:text-slate-900 hover:pl-4">
              Closed
            </li>
          </ul>

          <li className="mt-4 mb-2 text-xs text-slate-500 uppercase px-3 font-semibold tracking-wider">Invoices</li>
          <ul className="space-y-1">
            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 text-slate-600 hover:text-slate-900 hover:pl-4">
              Proforma Invoices
            </li>
            <li className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all duration-200 text-slate-600 hover:text-slate-900 hover:pl-4">
              Final Invoices
            </li>
          </ul>
        </ul>
      </nav>
    </aside>
  );

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-[1600px] mx-auto">
          {/* Header with gradient background */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Sales Management System
              </h1>
            </div>
            <SearchBar value={filters.q || ''} onChange={v => setFilters(f => ({ ...f, q: v, page: 1 }))} />
          </div>

          {/* Filters with enhanced card styling */}
          <div className="mb-6">
            <FiltersPanel filters={filters} setFilters={setFilters} options={OPTIONS} />
          </div>

          {/* Sort with better positioning */}
          <div className="flex justify-end mb-6">
            <SortDropdown sortBy={filters.sortBy} sortOrder={filters.sortOrder} setSort={setSort} />
          </div>

          {/* Stats with enhanced spacing */}
          <div className="mb-6">
            <StatsCards rows={data.data || []} meta={data.meta || {}} />
          </div>

          {/* Table with loading animation */}
          <div className="mt-6">
            {loading ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-500 font-medium">Loading transactions...</div>
              </div>
            ) : (
              <TransactionsTable rows={data.data || []} />
            )}
          </div>

          {/* Pagination with better spacing */}
          <div className="mt-6">
            <Pagination meta={data.meta || { page: 1, totalPages: 1 }} onPage={p => setFilters(f => ({ ...f, page: p }))} />
          </div>
        </div>
      </main>
    </div>
  );
}