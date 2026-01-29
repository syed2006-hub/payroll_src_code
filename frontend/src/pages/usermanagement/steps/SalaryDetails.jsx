import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salarySchema } from "../../../validation/employeeScemas";
import { useEmployeeForm } from "../context/EmployeeFormContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

const SalaryDetails = ({ onNext, onBack }) => {
  const { update, employee } = useEmployeeForm();
  const { token } = useContext(AuthContext);

  const [hraConfig, setHraConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch org statutory config
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/organization/settings",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await res.json();
        console.log(data);
        
        setHraConfig(data?.statutoryConfig?.hra || null);
      } catch (err) {
        console.error("Failed to fetch HRA config", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSettings();
  }, [token]);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      ctc: employee.salary?.ctc || 0,
      basicPercentage: 50
    }
  });

  const ctc = useWatch({ control, name: "ctc", defaultValue: 0 });

  // ---------------- CALCULATIONS ----------------
  const annualBasic = ctc * 0.5;
  const monthlyBasic = annualBasic / 12;

  const hraPercentage = hraConfig?.percentage || 40;
  const annualHra = (annualBasic * hraPercentage) / 100;
  const monthlyHra = annualHra / 12;

  const annualFixedAllowance =
    ctc - (annualBasic + annualHra);
  const monthlyFixedAllowance = annualFixedAllowance / 12;

  // ----------------------------------------------

  const onSubmit = (data) => {
    update("salary", {
      ...data,
      breakdown: {
        basic: annualBasic,
        hra: annualHra,
        fixedAllowance: annualFixedAllowance
      }
    });
    onNext();
  };

  if (loading) return <p className="text-center">Loading salary structure...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto p-6">
      {/* CTC INPUT */}
      <div className="flex items-center gap-4">
        <label className="w-32 font-medium">Annual CTC*</label>
        <input
          type="number"
          {...register("ctc")}
          className="border rounded px-3 py-2 w-64"
        />
      </div>

      {/* SALARY TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Component</th>
              <th className="p-3 text-left">Calculation</th>
              <th className="p-3 text-right">Monthly</th>
              <th className="p-3 text-right">Annual</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="p-3">Basic</td>
              <td className="p-3">50% of CTC</td>
              <td className="p-3 text-right">₹{monthlyBasic.toLocaleString("en-IN")}</td>
              <td className="p-3 text-right">₹{annualBasic.toLocaleString("en-IN")}</td>
            </tr>

            <tr>
              <td className="p-3">HRA</td>
              <td className="p-3">{hraPercentage}% of Basic</td>
              <td className="p-3 text-right">₹{monthlyHra.toLocaleString("en-IN")}</td>
              <td className="p-3 text-right">₹{annualHra.toLocaleString("en-IN")}</td>
            </tr>

            <tr>
              <td className="p-3">Fixed Allowance</td>
              <td className="p-3">Balance amount</td>
              <td className="p-3 text-right">₹{monthlyFixedAllowance.toLocaleString("en-IN")}</td>
              <td className="p-3 text-right">₹{annualFixedAllowance.toLocaleString("en-IN")}</td>
            </tr>

            <tr className="bg-gray-50 font-bold">
              <td className="p-3">CTC</td>
              <td></td>
              <td className="p-3 text-right">₹{(ctc / 12).toLocaleString("en-IN")}</td>
              <td className="p-3 text-right">₹{ctc.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="border px-6 py-2 rounded">
          Back
        </button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default SalaryDetails;
