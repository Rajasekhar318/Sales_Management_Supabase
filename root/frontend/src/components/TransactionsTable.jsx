// frontend/src/components/TransactionsTable.jsx
import React from 'react';

export default function TransactionsTable({ rows }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Customer ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Customer name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Age
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Product Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows && rows.length > 0 ? (
              rows.map((r, idx) => (
                <tr key={r.id ?? idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {r.transaction_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {r.date ? new Date(r.date).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.customer_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {r.customer_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      {r.phone_number}
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.gender}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.age}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {r.product_category}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                    {String(r.quantity || 0).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                    ₹{Number(r.final_amount ?? r.finalAmount ?? r.total_amount ?? 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}