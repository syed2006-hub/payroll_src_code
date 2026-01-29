import { useState } from "react";
import { useEmployeeForm } from "../context/EmployeeFormContext";
import { createEmployee } from "../services/employee.service";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { MdAccountBalance, MdPayments, MdArrowBack, MdCheckCircle } from "react-icons/md";

const PaymentDetails = ({ onBack }) => {
  const { employee, update } = useEmployeeForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const location = useLocation(); 
  const navigate = useNavigate();
  const payment = employee.payment || {};

  const handleFinish = async () => {
    setError("");

    if (!payment.mode) {
      return setError("Please select a payment mode to proceed.");
    }

    if (payment.mode === "BANK") {
      const { bankName, accountNumber, ifsc } = payment;
      if (!bankName || !accountNumber || !ifsc) {
        return setError("Please fill all mandatory bank details");
      }
    }

    try {
      setLoading(true);

      const payload = {
        ...employee,
        payment: {
          mode: payment.mode,
          details:
            payment.mode === "BANK"
              ? {
                  bankName: payment.bankName,
                  accountNumber: payment.accountNumber,
                  ifsc: payment.ifsc,
                  accountHolder: payment.accountHolder,
                }
              : {}
        }
      };

      await createEmployee(payload);

      const params = new URLSearchParams(searchParams);
      params.delete("operation");
      params.delete("id");
      navigate(`${location.pathname}?${params.toString()}`);
    } catch (err) {
      setError(err.message || "Failed to onboard employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1";
  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all outline-none border border-slate-200 bg-white text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PAYMENT MODE SELECTION */}
      <section>
        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
          Disbursement Method
        </h3>
        <div className="max-w-md flex flex-col">
          <label className={labelClass}>Payment Mode *</label>
          <div className="relative">
            <MdPayments className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              className={`${inputClass} pl-11 appearance-none`}
              value={payment.mode || ""}
              onChange={(e) => update("payment", {...payment, mode: e.target.value })}
            >
              <option value="">Select payment mode</option>
              <option value="BANK">Bank Transfer (NEFT/RTGS)</option>
              <option value="CASH">Cash Distribution</option>
              <option value="CHEQUE">Business Cheque</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. BANK DETAILS SECTION (Glass-Slab Style) */}
      {payment.mode === "BANK" && (
        <section className="relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-[14px] p-6 relative">
            <div className="absolute right-0 top-1/4 bottom-1/4 w-1.5 rounded-l-full bg-indigo-600" />
            
            <div className="flex items-center gap-2 mb-6">
              <MdAccountBalance className="text-indigo-600" size={22} />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Bank Account Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className={labelClass}>Bank Name *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. HDFC Bank"
                  value={payment.bankName || ""}
                  onChange={(e) => update("payment", {...payment, bankName: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>Account Number *</label>
                <input
                  className={inputClass}
                  placeholder="000000000000"
                  value={payment.accountNumber || ""}
                  onChange={(e) => update("payment", {...payment, accountNumber: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>IFSC Code *</label>
                <input
                  className={`${inputClass} uppercase`}
                  placeholder="HDFC0001234"
                  value={payment.ifsc || ""}
                  onChange={(e) => update("payment", {...payment, ifsc: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="flex flex-col">
                <label className={labelClass}>Account Holder Name</label>
                <input
                  className={inputClass}
                  placeholder="As per bank records"
                  value={payment.accountHolder || ""}
                  onChange={(e) => update("payment", {...payment, accountHolder: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold animate-shake">
          {error}
        </div>
      )}

      {/* FOOTER NAVIGATION */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onBack} 
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
        >
          <MdArrowBack /> Prev
        </button>
        
        <button 
          onClick={handleFinish}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-10 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:shadow-none"
        >
          {loading ? "Onboarding..." : "Complete Onboarding"} 
          {!loading && <MdCheckCircle className="ml-1" size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PaymentDetails;