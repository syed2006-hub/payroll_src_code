import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicSchema } from "../../../validation/employeeScemas";
import { checkEmployeeExists } from "../../../api/employeeApi";
import { useEmployeeForm } from "../context/EmployeeFormContext";
import { useState } from "react";

const BasicDetails = ({ onNext }) => {
  const { update, employee } = useEmployeeForm();
  const [checking, setChecking] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(basicSchema),
    defaultValues: employee.basic // Pre-fill if user goes back
  });

  const onSubmit = async (data) => {
    setChecking(true);
    setDuplicateError("");
    const res = await checkEmployeeExists({
      email: data.email,
      employeeId: data.employeeId
    });

    setChecking(false);

    if (res.exists) {
      setDuplicateError("Email or Employee ID already exists in the system.");
      return;
    }

    update("basic", data);
    onNext();
  };

  const inputClass = (error) => 
    `border p-2 rounded w-full outline-none focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto p-6 bg-white">
      {/* Employee Name Section - 3 Columns */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">First Name*</label>
          <input {...register("firstName")} placeholder="First Name" className={inputClass(errors.firstName)} />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Middle Name</label>
          <input {...register("middleName")} placeholder="Middle Name" className={inputClass()} />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Last Name</label>
          <input {...register("lastName")} placeholder="Last Name" className={inputClass()} />
        </div>
      </div>

      {/* ID, Date, Email, Mobile, and Password Section */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Employee ID*</label>
          <input {...register("employeeId")} className={inputClass(errors.employeeId)} />
          {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Date of Joining*</label>
          <input type="date" {...register("doj")} className={inputClass(errors.doj)} />
          {errors.doj && <p className="text-red-500 text-xs mt-1">{errors.doj.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Work Email*</label>
          <input {...register("email")} placeholder="abc@xyz.com" className={inputClass(errors.email)} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Mobile Number</label>
          <input {...register("mobile")} className={inputClass()} />
        </div>
        {/* New Password Field */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Portal Password*</label>
          <input 
            type="password" 
            {...register("password")} 
            placeholder="Set portal password" 
            className={inputClass(errors.password)} 
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
      </div>

      {/* Director Checkbox */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" {...register("isDirector")} id="isDirector" className="w-4 h-4" />
        <label htmlFor="isDirector">
          Employee is a <strong>Director/person with substantial interest</strong> in the company. 
          <span className="text-gray-400 ml-1">ⓘ</span>
        </label>
      </div>

      {/* Select Grids */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Gender*</label>
          <select {...register("gender")} className={inputClass(errors.gender)}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Others</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Work Location*</label>
          <select {...register("location")} className={inputClass(errors.location)}>
            <option value="">Select</option>
            <option value="Head Office">Head Office (Chennai)</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Designation*</label>
          <select {...register("designation")} className={inputClass(errors.designation)}>
            <option value="">Select</option>
            <option value="Software Engineer">Software Engineer</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Department*</label>
          <select {...register("department")} className={inputClass(errors.department)}>
            <option value="">Select</option> 
            <option value="Payroll Admin">Payroll Admin</option>
            <option value="Employee">Employee</option>
            <option value="HR Admin">HR Admin</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Portal Access Box */}
      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-md">
        <div className="flex items-center gap-2 font-medium text-sm">
          <input type="checkbox" {...register("enablePortal")} id="portal" className="w-4 h-4" />
          <label htmlFor="portal">Enable Portal Access</label>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-6 leading-relaxed">
          The employee will be able to view payslips, submit their IT declaration and create reimbursement claims through the employee portal.
        </p>
      </div>

      {/* Duplicate Error Alert */}
      {duplicateError && (
        <p className="bg-red-50 text-red-600 p-2 rounded border border-red-200 text-sm">
          {duplicateError}
        </p>
      )}

      {/* Footer Button */}
      <div className="pt-4 border-t border-gray-100">
        <button 
          disabled={checking} 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors disabled:bg-gray-400"
        >
          {checking ? "Verifying..." : "Save and Continue"}
        </button>
      </div>
    </form>
  );
};

export default BasicDetails;