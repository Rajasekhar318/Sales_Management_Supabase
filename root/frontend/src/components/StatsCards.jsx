// frontend/src/components/StatsCards.jsx
import React, { useMemo } from 'react';

export default function StatsCards({ rows, meta }) {
  const summary = useMemo(() => {
    let units = 0;
    let totalAmount = 0;
    let totalDiscount = 0;

    for (const r of rows || []) {
      const qty = Number(r.quantity || 0);
      units += qty;
      const total = Number(r.total_amount ?? r.totalAmount ?? 0);
      const finalA = Number(r.final_amount ?? r.finalAmount ?? 0);
      totalAmount += finalA || total;
      totalDiscount += (total - finalA) || 0;
    }

    return { units, totalAmount, totalDiscount };
  }, [rows]);

  function money(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN');
  }

  const srsCount = rows?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {/* Total units sold */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span>Total units sold</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{summary.units}</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span>Total Amount</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{money(summary.totalAmount)}</div>
            <div className="text-xs text-gray-500 mt-1">({srsCount} SRs)</div>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Discount */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span>Total Discount</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">{money(summary.totalDiscount)}</div>
            <div className="text-xs text-gray-500 mt-1">({srsCount} SRs)</div>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}