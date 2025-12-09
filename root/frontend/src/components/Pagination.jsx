// frontend/src/components/Pagination.jsx
import React from 'react';

export default function Pagination({ meta, onPage }) {
  const { page = 1, totalPages = 1 } = meta || {};

  const windowSize = 7;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center py-6 gap-1">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`min-w-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            p === page
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}