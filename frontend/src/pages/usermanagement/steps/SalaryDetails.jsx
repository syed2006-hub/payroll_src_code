import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salarySchema } from "../../../validation/employeeScemas";
import { useEmployeeForm } from "../context/EmployeeFormContext";

const SalaryDetails = ({ onNext, onBack }) => {
  const { update, employee } = useEmployeeForm();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(salarySchema),
    defaultValues: { ctc: employee.salary?.ctc || 0, basicPercentage: 50 }
  });

  // Watch CTC to update table dynamically
  const ctc = useWatch({ control, name: "ctc", defaultValue: 0 });
  const annualBasic = (ctc * 0.5);
  const monthlyBasic = (annualBasic / 12);

  const onSubmit = (data) => {
    update("salary", data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <label className="w-32 font-medium text-gray-700">Annual CTC*</label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-500">₹</span>
          <input 
            type="number"
            {...register("ctc")}
            className="pl-8 pr-20 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none w-64"
          />
          <span className="absolute right-3 text-xs text-gray-400">per year</span>
        </div>
        {errors.ctc && <p className="text-red-500 text-xs">{errors.ctc.message}</p>}
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3 text-left font-semibold">SALARY COMPONENTS</th>
              <th className="p-3 text-left font-semibold">CALCULATION TYPE</th>
              <th className="p-3 text-right font-semibold">MONTHLY AMOUNT</th>
              <th className="p-3 text-right font-semibold">ANNUAL AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            <tr>
              <td className="p-3">Basic</td>
              <td className="p-3">50% of CTC</td>
              <td className="p-3 text-right">₹{monthlyBasic.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="p-3 text-right">₹{annualBasic.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
            </tr>
            <tr className="bg-gray-50 font-bold border-t-2">
              <td className="p-3">Cost to Company</td>
              <td className="p-3"></td>
              <td className="p-3 text-right">₹{(ctc / 12).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className="p-3 text-right">₹{Number(ctc).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onBack} className="border px-6 py-2 rounded text-gray-600">Back</button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Save & Continue</button>
      </div>
    </form>
  );
};

export default SalaryDetails;