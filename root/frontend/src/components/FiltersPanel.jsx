// frontend/src/components/FiltersPanel.jsx
import React, { useState, useRef, useEffect } from 'react';

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current || !ref.current.contains(e.target)) handler();
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [ref, handler]);
}

function DropdownMulti({ label, name, options = [], selected = [], onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOutsideClick(ref, () => setOpen(false));

  function toggleOption(opt) {
    const s = new Set(selected || []);
    if (s.has(opt)) s.delete(opt); else s.add(opt);
    onChange(Array.from(s));
  }

  function clearAll() {
    onChange([]);
  }

  const selectedCount = (selected || []).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm hover:border-gray-300 transition-colors min-w-[140px]"
      >
        <span className="text-gray-700 font-medium">{label}</span>
        {selectedCount > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{selectedCount}</span>
        )}
        <svg className={`w-4 h-4 text-gray-500 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02L10 10.67l3.71-3.48a.75.75 0 111.04 1.08l-4.25 4a.75.75 0 01-1.04 0l-4.25-4a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <div className="text-sm text-gray-700 font-semibold">{label}</div>
            {selectedCount > 0 && (
              <button onClick={clearAll} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-auto">
            {options.length === 0 ? (
              <div className="text-sm text-gray-400 py-2">No options available</div>
            ) : (
              options.map(opt => {
                const checked = (selected || []).includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOption(opt)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-600'} group-hover:text-gray-900`}>
                      {opt}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FiltersPanel({ filters, setFilters, options }) {
  options = options || {};

  function setArrayFilter(key, arr) {
    const payload = { ...filters, page: 1 };
    if (!arr || arr.length === 0) delete payload[key];
    else payload[key] = arr;
    setFilters(payload);
  }

  function setRange(key, value) {
    const payload = { ...filters, page: 1 };
    if (value === undefined || value === '') delete payload[key];
    else payload[key] = String(value);
    setFilters(payload);
  }

  function resetAll() {
    setFilters({ page: 1, pageSize: filters.pageSize || 10, sortBy: filters.sortBy, sortOrder: filters.sortOrder });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left group of dropdowns */}
        <div className="flex gap-1 flex-wrap items-center">
          <DropdownMulti
            label="Customer Region"
            name="regions"
            options={options.regions || []}
            selected={filters.regions || []}
            onChange={(arr) => setArrayFilter('regions', arr)}
          />

          <DropdownMulti
            label="Gender"
            name="genders"
            options={options.genders || []}
            selected={filters.genders || []}
            onChange={(arr) => setArrayFilter('genders', arr)}
          />

          <DropdownMulti
            label="Age Range"
            name="ageRange"
            options={['18-25', '26-35', '36-45', '46+']}
            selected={[]}
            onChange={() => {}}
          />

          <DropdownMulti
            label="Product Category"
            name="categories"
            options={options.categories || []}
            selected={filters.categories || []}
            onChange={(arr) => setArrayFilter('categories', arr)}
          />

          <DropdownMulti
            label="Tags"
            name="tags"
            options={options.tags || []}
            selected={filters.tags || []}
            onChange={(arr) => setArrayFilter('tags', arr)}
          />

          <DropdownMulti
            label="Payment Method"
            name="paymentMethods"
            options={options.paymentMethods || []}
            selected={filters.paymentMethods || []}
            onChange={(arr) => setArrayFilter('paymentMethods', arr)}
          />

          <DropdownMulti
            label="Date"
            name="date"
            options={['Today', 'Last 7 days', 'Last 30 days', 'Custom']}
            selected={[]}
            onChange={() => {}}
          />
        </div>

        {/* Reset button */}
        <button 
          onClick={resetAll} 
          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}