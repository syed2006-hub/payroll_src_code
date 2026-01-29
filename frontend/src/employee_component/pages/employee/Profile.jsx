import { useContext } from 'react';
import {
  MdPerson,
  MdMail,
  MdWork,
  MdCalendarToday,
  MdAccountBalance,
  MdBadge,
  MdLocationOn,
  MdCake,
  MdPhoneIphone,
  MdFingerprint
} from 'react-icons/md';
import { AuthContext } from '../../../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);
  
  const basic = user?.employeeDetails?.basic;
  const personal = user?.employeeDetails?.personal;
  const payment = user?.employeeDetails?.payment;

  // Safe Derived Values
  const fullName = basic ? `${basic.firstName} ${basic.lastName}` : 'Employee User';
  const initials = fullName !== 'Employee User' 
    ? fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'EU';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ===== 1. PROFILE TOP HEADER ===== */}
      <div className="relative overflow-hidden rounded-3xl p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
        <div className="bg-white/95 backdrop-blur-md rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative">
          {/* Signature Accent Bar */}
          <div className="absolute right-0 top-1/4 bottom-1/4 w-1.5 rounded-l-full bg-gradient-to-b from-indigo-500 to-purple-600" />
          
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-indigo-200 shrink-0">
            {initials}
          </div>

          <div className="text-center md:text-left min-w-0 flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{fullName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                {user?.role ?? 'Role Not Set'}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                {basic?.department ?? 'General'}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-400 mt-3 flex items-center justify-center md:justify-start gap-1">
              <MdLocationOn size={16} /> {basic?.location?? 'Remote'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== 2. DETAILS GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* EMPLOYMENT CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1.5 bg-indigo-600" />
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
             <MdWork className="text-indigo-600" size={22} />
             <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Employment Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailItem icon={MdBadge} label="Employee ID" value={basic?.employeeId} />
            <DetailItem icon={MdCalendarToday} label="Date of Joining" value={basic?.doj} />
            <DetailItem icon={MdWork} label="Department" value={basic?.department} />
            <DetailItem icon={MdLocationOn} label="Work Location" value={basic?.location} />
          </div>
        </div>

        {/* PERSONAL CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1.5 bg-emerald-500" />
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
             <MdPerson className="text-emerald-600" size={22} />
             <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Personal Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailItem icon={MdMail} label="Work Email" value={basic?.email} isIndigo />
            <DetailItem icon={MdPhoneIphone} label="Mobile Number" value={basic?.mobile} />
            <DetailItem icon={MdCake} label="Date of Birth" value={personal?.dob} />
            <DetailItem icon={MdFingerprint} label="PAN Number" value={personal?.pan} />
          </div>
        </div>

        {/* BANKING CARD - Full Width */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative lg:col-span-2">
          <div className="absolute right-0 top-0 h-full w-1.5 bg-amber-500" />
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
             <MdAccountBalance className="text-amber-600" size={22} />
             <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Payment Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <DetailItem icon={MdAccountBalance} label="Bank Name" value={payment?.details?.bankName} />
            <DetailItem icon={MdBadge} label="Account Number" value={payment?.details?.accountNumber} />
            <DetailItem icon={MdFingerprint} label="IFSC Code" value={payment?.details?.ifsc} />
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Payment Method</p>
               <p className="text-sm font-black text-slate-800">{payment?.mode || 'NOT SET'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===== REUSABLE DETAIL ROW (SAME PINCH STYLE) ===== */
function DetailItem({ icon: Icon, label, value, isIndigo }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className={`mt-1 p-2 rounded-xl transition-colors ${isIndigo ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-700 truncate">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}