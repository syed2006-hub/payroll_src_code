import { useContext } from 'react';
import { MdDashboard, MdReceiptLong, MdDescription, MdFolder, MdNotifications, MdPerson, MdSettings, MdLogout, MdClose } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const menu = [
  { label: 'Dashboard', key: 'dashboard', icon: MdDashboard },
  { label: 'Payslips', key: 'payslips', icon: MdReceiptLong },
  { label: 'Salary Structure', key: 'salary', icon: MdDescription },
  { label: 'Documents', key: 'documents', icon: MdFolder },
  { label: 'Notifications', key: 'notifications', icon: MdNotifications },
  { label: 'Profile', key: 'profile', icon: MdPerson },
  { label: 'Settings', key: 'settings', icon: MdSettings },
];

export default function EmpSidebar({ isOpen, onClose }) {
  const { user, Employeelogout } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('section') || 'dashboard';

  const getInitials = (name) => {
    if (!name) return "EE";
    return name.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).join('').slice(0, 2);
  };

  const handleNavClick = (key) => {
    setSearchParams({ section: key });
    onClose(); // Close drawer on mobile after selection
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* MOBILE CLOSE BUTTON */}
        <button onClick={onClose} className="lg:hidden absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600">
          <MdClose size={24} />
        </button>

        {/* PROFILE HEADER (Matching Dashboard) */}
        <div className="p-8 border-b border-slate-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100 mb-4">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-800 truncate text-sm">
              {user?.name ?? 'Employee'}
            </p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">
              {user?.role ?? 'User'}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
          {menu.map(({ label, key, icon: Icon }) => {
            const isActive = key === activeSection;
            return (
              <div
                key={key}
                onClick={() => handleNavClick(key)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={22} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={Employeelogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold text-sm"
          >
            <MdLogout size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}