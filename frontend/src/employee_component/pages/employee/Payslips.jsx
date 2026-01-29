import { useState } from 'react';
import { FiFileText, FiEye, FiDownload, FiX } from 'react-icons/fi';

export default function Payslips() {
  // ✅ TEMP UI DATA (remove when backend is ready)
  const payslips = [
    {
      id: 'PS-2024-01',
      month: 'January',
      year: 2024,
      payableDays: 31,
      grossEarnings: 45000,
      totalDeductions: 5000,
      netPay: 40000,
    },
    {
      id: 'PS-2023-12',
      month: 'December',
      year: 2023,
      payableDays: 30,
      grossEarnings: 45000,
      totalDeductions: 4800,
      netPay: 40200,
    },
    {
      id: 'PS-2023-11',
      month: 'November',
      year: 2023,
      payableDays: 30,
      grossEarnings: 45000,
      totalDeductions: null, // intentionally null
      netPay: 45000,
    },
  ];

  const [selectedPayslip, setSelectedPayslip] = useState(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
          <FiFileText />
          Payslips
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          View and download your salary payslips
        </p>
      </div>

      {/* Payslips Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-text-secondary">
            <tr>
              <th className="px-6 py-3 text-left">Month</th>
              <th className="px-6 py-3 text-left">Payable Days</th>
              <th className="px-6 py-3 text-right">Gross</th>
              <th className="px-6 py-3 text-right">Deductions</th>
              <th className="px-6 py-3 text-right">Net Pay</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {payslips.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {p.month} {p.year}
                  </div>
                  <div className="text-xs text-text-muted">
                    ID: {p.id}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {p.payableDays ?? '—'}
                </td>

                <td className="px-6 py-4 text-right">
                  {money(p.grossEarnings)}
                </td>

                <td className="px-6 py-4 text-right text-danger">
                  {money(p.totalDeductions)}
                </td>

                <td className="px-6 py-4 text-right text-success font-semibold">
                  {money(p.netPay)}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedPayslip(p)}
                      className="flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <FiEye size={16} />
                      View
                    </button>

                    <button
                      className="flex items-center gap-1 text-text-muted cursor-not-allowed font-medium"
                      title="Handled by backend later"
                    >
                      <FiDownload size={16} />
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== INLINE PAYSLIP DETAILS UI ===== */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="w-full max-w-md bg-white h-full p-6 shadow-xl overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                Payslip Details
              </h3>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 text-sm">
              <Detail label="Month" value={`${selectedPayslip.month} ${selectedPayslip.year}`} />
              <Detail label="Payable Days" value={selectedPayslip.payableDays ?? '—'} />
              <Detail label="Gross Earnings" value={money(selectedPayslip.grossEarnings)} />
              <Detail label="Total Deductions" value={money(selectedPayslip.totalDeductions)} />
              <Detail label="Net Pay" value={money(selectedPayslip.netPay)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Small UI helpers ===== */

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function money(value) {
  return value != null ? `₹${value.toLocaleString()}` : '—';
}
