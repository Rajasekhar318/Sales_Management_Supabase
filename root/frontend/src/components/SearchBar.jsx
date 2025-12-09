// frontend/src/components/SearchBar.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Name, Phone no.' }) {
  const [local, setLocal] = useState(value || '');
  const prevSentRef = useRef(value || '');

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      // Only call onChange when value actually differs from the last sent value
      if ((prevSentRef.current || '') !== (local || '')) {
        onChange(local);
        prevSentRef.current = local;
      }
    }, 300);

    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div className="relative w-full sm:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
      />
    </div>
  );
}
