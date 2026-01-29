import { useEmployeeForm } from "../context/EmployeeFormContext";
import { MdArrowBack, MdArrowForward, MdCake, MdLocationOn, MdFingerprint } from "react-icons/md";

const PersonalDetails = ({ onNext, onBack }) => {
  const { employee, update } = useEmployeeForm();
  const personal = employee.personal || {};

  // Simple age calculation helper
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const labelClass = "text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1";
  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all outline-none border border-slate-200 bg-white text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. IDENTITY SECTION */}
      <section>
        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
          Statutory Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className={labelClass}>Date of Birth*</label>
            <div className="relative">
              <MdCake className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                className={`${inputClass} pl-11`}
                value={personal.dob || ""}
                onChange={e => update("personal", { ...personal, dob: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Age</label>
            <input 
              disabled 
              value={calculateAge(personal.dob)}
              placeholder="Auto-calculated"
              className={`${inputClass} bg-slate-50 text-slate-400 border-dashed cursor-not-allowed`} 
            />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Father's Name*</label>
            <input
              className={inputClass}
              placeholder="Enter full name"
              value={personal.fatherName || ""}
              onChange={e => update("personal", { ...personal, fatherName: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>PAN Number</label>
            <div className="relative">
              <MdFingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className={`${inputClass} pl-11 uppercase`}
                placeholder="AAAAA0000A"
                maxLength={10}
                value={personal.pan || ""}
                onChange={e => update("personal", { ...personal, pan: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. ADDRESS SECTION */}
      <section className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
          <MdLocationOn className="text-indigo-600" size={20} />
          Residential Address
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className={labelClass}>Address Line 1</label>
            <input
              className={inputClass}
              placeholder="Door No, Building Name, Street"
              value={personal.addressLine1 || ""}
              onChange={e => update("personal", { ...personal, addressLine1: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Address Line 2</label>
            <input
              className={inputClass}
              placeholder="Locality, Area, Landmark"
              value={personal.addressLine2 || ""}
              onChange={e => update("personal", { ...personal, addressLine2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className={labelClass}>City</label>
              <input
                className={inputClass}
                placeholder="City"
                value={personal.city || ""}
                onChange={e => update("personal", { ...personal, city: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className={labelClass}>State</label>
              <select
                className={inputClass}
                value={personal.state || ""}
                onChange={e => update("personal", { ...personal, state: e.target.value })}
              >
                <option value="">Select State</option>
                <option>Tamil Nadu</option>
                <option>Karnataka</option>
                <option>Kerala</option>
                <option>Andhra Pradesh</option>
                <option>Maharashtra</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className={labelClass}>PIN Code</label>
              <input
                className={inputClass}
                placeholder="600001"
                maxLength={6}
                value={personal.pincode || ""}
                onChange={e => update("personal", { ...personal, pincode: e.target.value })}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NAVIGATION */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
        >
          <MdArrowBack /> Prev
        </button>
        
        <button 
          onClick={onNext} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          Save and Continue <MdArrowForward />
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;