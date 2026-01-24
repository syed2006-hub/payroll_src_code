import { useState } from "react";
import { useEmployeeForm } from "../context/EmployeeFormContext";
import { createEmployee } from "../services/employee.service";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const PaymentDetails = ({ onBack, onSuccess }) => {
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
      return setError("Please select a payment mode");
    }

    if (payment.mode === "BANK") {
      const { bankName, accountNumber, ifsc } = payment;
      if (!bankName || !accountNumber || !ifsc) {
        return setError("Please fill all bank details");
      }
    }

    try {
      setLoading(true);

      // ✅ TRANSFORM payment here
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
      setError(err.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-lg font-semibold">Payment Details</h2>

      {/* PAYMENT MODE */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Payment Mode *</label>
        <select
          className="border rounded p-2 w-full"
          value={payment.mode || ""}
          onChange={(e) => update("payment", {...payment,  mode: e.target.value })}
        >
          <option value="">Select payment mode</option>
          <option value="BANK">Bank Transfer</option>
          <option value="CASH">Cash</option>
          <option value="CHEQUE">Cheque</option>
        </select>
      </div>

      {/* BANK DETAILS */}
      {payment.mode === "BANK" && (
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
          <div>
            <label className="text-sm">Bank Name *</label>
            <input
              className="border p-2 rounded w-full"
              onChange={(e) =>
                update("payment", {...payment,  bankName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm">Account Number *</label>
            <input
              className="border p-2 rounded w-full"
              onChange={(e) =>
                update("payment", {...payment,  accountNumber: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm">IFSC Code *</label>
            <input
              className="border p-2 rounded w-full"
              onChange={(e) =>
                update("payment", {...payment,  ifsc: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm">Account Holder Name</label>
            <input
              className="border p-2 rounded w-full"
              onChange={(e) =>
                update("payment", {...payment,  accountHolder: e.target.value })
              }
            />
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* ACTION BUTTONS */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="border px-6 py-2 rounded"
        >
          Back
        </button>

        <button
          onClick={handleFinish}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Finish"}
        </button>
      </div>
    </div>
  );
};

export default PaymentDetails;
