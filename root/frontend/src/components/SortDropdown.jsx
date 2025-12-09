// frontend/src/components/SortDropdown.jsx
import React from 'react';

export default function SortDropdown({ sortBy, sortOrder, setSort }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">Sort by:</span>
      <select 
        value={sortBy || 'date'} 
        onChange={e => setSort(e.target.value, sortOrder)} 
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
      >
        <option value="date">Date (Newest)</option>
        <option value="quantity">Quantity</option>
        <option value="customerName">Customer Name (A–Z)</option>
      </select>
      
      <button 
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
        onClick={() => setSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        {sortOrder === 'asc' ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Ascending
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            Descending
          </>
        )}
      </button>
    </div>
  );
}