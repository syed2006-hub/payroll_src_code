import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { MdArrowBack, MdClose, MdPersonAddAlt1 } from "react-icons/md";
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
    <SalaryDetails onNext={() => setStep(2)} onBack={handleBack} />,
    <PersonalDetails onNext={() => setStep(3) } onBack={handleBack}/>,
    <PaymentDetails onBack={handleBack}/>
  ];

  return (
    <EmployeeFormProvider>
      <div className="max-w-5xl mx-auto px-0 md:px-4 lg:px-8">
        
        {/* --- MAIN CONTAINER --- */}
        <div className="bg-white md:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden min-h-[calc(100vh-120px)] flex flex-col">
          
          {/* --- TOP HEADER --- */}
          <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {/* Back Icon Button */}
        
              
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MdPersonAddAlt1 className="text-indigo-600 hidden sm:block" size={20} />
                  <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight truncate">
                    Onboard Employee
                  </h1>
                </div>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Step {step + 1} of {steps.length} • {step === 3 ? 'Finalizing' : 'Information'}
                </p>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1"
            >
              <MdClose size={18} />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          </div>

          {/* --- STEPPER PROGRESS --- */}
          <div className="bg-slate-50/50 py-4 md:py-8 border-b border-slate-100 px-4 md:px-10">
            <Stepper currentStep={step} onBack={handleBack} />
          </div>

          {/* --- FORM CONTENT --- */}
          <div className="flex-1 p-4 md:p-8 lg:p-12 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
             <div className="max-w-3xl mx-auto h-full">
                {steps[step]}
             </div>
          </div>

        </div>

        {/* --- FOOTER INFO (Optional) --- */}
        <div className="mt-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Data is encrypted and saved locally as you progress
          </p>
        </div>
      </div>
    </EmployeeFormProvider>
  );
};

export default AddEmployee;