import { useState } from 'react';
import { FiFileText, FiSave, FiCheckCircle } from 'react-icons/fi';

export default function TaxDeclarations() {
  // ✅ Inline UI data (backend will replace this)
  const financialYear = '2024–2025';

  const [declarations, setDeclarations] = useState({
    hra: '',
    section80c: '',
    section80d: '',
    nps: '',
    other: '',
  });

  const isSubmitted = false; // backend-controlled later

  const handleChange = (key, value) => {
    setDeclarations(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const totalDeclared = Object.values(declarations)
    .map(v => Number(v) || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FiFileText />
          Tax Declarations
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Declare your investments for FY {financialYear}
        </p>
      </div>

      {/* Status */}
      <div className="bg-white border rounded-xl p-4 text-sm">
        <p>
          Status:{' '}
          <span className={`font-medium ${isSubmitted ? 'text-success' : 'text-warning'}`}>
            {isSubmitted ? 'Submitted' : 'Not Submitted'}
          </span>
        </p>
      </div>

      {/* Declaration Form */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <DeclarationRow
          label="House Rent Allowance (HRA)"
          value={declarations.hra}
          onChange={v => handleChange('hra', v)}
        />

        <DeclarationRow
          label="Section 80C (PF, LIC, ELSS)"
          value={declarations.section80c}
          onChange={v => handleChange('section80c', v)}
        />

        <DeclarationRow
          label="Section 80D (Medical Insurance)"
          value={declarations.section80d}
          onChange={v => handleChange('section80d', v)}
        />

        <DeclarationRow
          label="NPS (Section 80CCD)"
          value={declarations.nps}
          onChange={v => handleChange('nps', v)}
        />

        <DeclarationRow
          label="Other Deductions"
          value={declarations.other}
          onChange={v => handleChange('other', v)}
        />
      </div>

      {/* Summary */}
      <div className="bg-white border rounded-xl p-4 flex items-center justify-between text-sm">
        <span className="font-medium">Total Declared Amount</span>
        <span className="font-semibold">
          ₹{totalDeclared.toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {/* Save Draft – neutral */}
        <button
          className="flex items-center gap-2 px-4 py-2
                     bg-slate-200 text-slate-700
                     rounded-md text-sm font-medium
                     hover:bg-slate-300 transition"
        >
          <FiSave />
          Save Draft
        </button>
        
        {/* Submit – primary/final */}
        <button
          className="flex items-center gap-2 px-4 py-2
                     bg-emerald-600 text-white
                     rounded-md text-sm font-medium
                     hover:bg-emerald-700 transition"
        >
          <FiCheckCircle />
          Submit Declaration
        </button>
      </div>
        
          </div>
        );
      }

/* ================= Helper ================= */

function DeclarationRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        placeholder="₹ 0"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-40 border rounded-md px-3 py-1.5 text-right focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
