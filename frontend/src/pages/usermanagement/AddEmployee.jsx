import { useState } from "react";
import { useNavigate,useLocation,useSearchParams } from "react-router-dom";
import Stepper from "./components/Stepper";
import { EmployeeFormProvider } from "./context/EmployeeFormContext";

import BasicDetails from "./steps/BasicDetails";
import SalaryDetails from "./steps/SalaryDetails";
import PersonalDetails from "./steps/PersonalDetails";
import PaymentDetails from "./steps/PaymentDetails";
const AddEmployee = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("operation");
    params.delete("id");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleBack = () => {
    if (step === 0) {
      handleCancel();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const steps = [
    <BasicDetails onNext={() => setStep(1)} />,
    <SalaryDetails onNext={() => setStep(2)} />,
    <PersonalDetails onNext={() => setStep(3)} />,
    <PaymentDetails />
  ];

  return (
    <EmployeeFormProvider>
      <div className="max-w-6xl mx-auto p-8 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
              {/* The Cancel Button */}
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>

              
         

          <h1 className="text-xl font-bold">Add Employee</h1>
        </div>

        <Stepper currentStep={step} onBack={handleBack} />

        <div className="mt-6">{steps[step]}</div>
      </div>
    </EmployeeFormProvider>
  );
};


export default AddEmployee;
