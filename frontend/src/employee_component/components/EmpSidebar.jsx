/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import {
  MdDashboard,
  MdReceiptLong,
  MdDescription,
  MdFolder,
  MdNotifications,
  MdPerson,
  MdSettings,
  MdLogout,
} from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const menu = [
  { label: 'Dashboard', key: 'dashboard', icon: MdDashboard },
  { label: 'Payslips', key: 'payslips', icon: MdReceiptLong },
  { label: 'Tax Declarations', key: 'tax', icon: MdDescription },
  { label: 'Documents', key: 'documents', icon: MdFolder },
  { label: 'Notifications', key: 'notifications', icon: MdNotifications },
  { label: 'Profile', key: 'profile', icon: MdPerson },
  { label: 'Settings', key: 'settings', icon: MdSettings },
];

export default function EmpSidebar() {
  const { user, logout } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSection = searchParams.get('section') || 'dashboard';

  // Helper to get initials (e.g., "Syed Rizwan" -> "SR")
  const getInitials = (name) => {
    if (!name) return "EE";
    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0].toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-surface-200 flex flex-col shadow-sm">
      
      {/* ===== Profile Section ===== */}
      <div className="px-6 py-8 border-b border-surface-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-xl font-bold shadow-md mb-3">
          {getInitials(user?.name)}
        </div>

        <div className="min-w-0">
          <p className="font-bold text-content-primary truncate">
            {user?.name ?? 'Employee'}
          </p>
          <p className="text-xs font-semibold text-brand uppercase tracking-wider mt-1">
            {user?.role ?? 'User'}
          </p>
          {user?.department && (
            <p className="text-[10px] text-content-muted uppercase mt-1 px-2 py-0.5 bg-surface-100 rounded-full inline-block">
              {user.department}
            </p>
          )}
        </div>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 custom-scrollbar">
        {menu.map(({ label, key, icon: Icon }) => {
          const isActive = key === activeSection;

          return (
            <div
              key={key}
              onClick={() => setSearchParams({ section: key })}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-brand-light text-brand-dark'
                    : 'text-content-secondary hover:bg-surface-50 hover:text-content-primary'
                }
              `}
            >
              <Icon 
                size={22} 
                className={isActive ? 'text-brand-dark' : 'text-content-subtle group-hover:text-content-muted'} 
              />
              <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* ===== Logout ===== */}
      <div className="p-4 border-t border-surface-100 bg-surface-50/30">
        <button
          onClick={logout}
          className="
            w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg
            text-content-secondary hover:text-danger hover:bg-danger/5
            text-sm font-semibold transition-all duration-200
          "
        >
          <MdLogout size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}