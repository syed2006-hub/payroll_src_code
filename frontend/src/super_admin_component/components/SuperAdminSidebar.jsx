import { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSecurity,
  MdAssessment,
  MdSettings,
  MdLogout,
  MdExpandMore,
  MdExpandLess,
  MdPayments,
  MdClose, // Added Close icon for mobile
} from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

export default function SuperAdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [payrunOpen, setPayrunOpen] = useState(false);

  const activeSection = searchParams.get("section") || "dashboard";
  const roleToPath = (role) => role?.toLowerCase().replace(/\s+/g, "") || "";
  const role = roleToPath(user?.role);

  const getInitials = (name) => {
    if (!name) return "AD";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const baseMenu = [
    { label: "Dashboard", section: "dashboard", icon: <MdDashboard /> },
    { label: "Employees", section: "users", icon: <MdPeople /> },
    { label: "Roles and Access", section: "roles", icon: <MdSecurity /> },
    { label: "Reports", section: "reports", icon: <MdAssessment /> },
    { label: "Settings", section: "settings", icon: <MdSettings /> },
  ];

  const getMenuByRole = () => {
    if (role === "superadmin") return baseMenu;
    if (role === "hradmin") return baseMenu.filter((m) => !["settings", "roles"].includes(m.section));
    if (role === "payrolladmin" || role === "finance") return baseMenu.filter((m) => ["dashboard", "reports"].includes(m.section));
    return [];
  };

  const filteredMenu = getMenuByRole();
  const dashboardItem = filteredMenu.find(m => m.section === "dashboard");
  const employeeItem = filteredMenu.find(m => m.section === "users");
  const otherItems = filteredMenu.filter(m => !["dashboard", "users"].includes(m.section));

  const payrunMenu = [
    { label: "Payroll Dashboard", section: "payroll-dashboard" },
    { label: "Run Payroll", section: "run-payroll" },
    { label: "Approve Payroll", section: "approve-payroll" },
  ];

  const showPayrun = role === "superadmin" || role === "payrolladmin";

  const goTo = (section) => {
    navigate(`/payroll/${roleToPath(user.role)}?section=${section}`);
    setIsMobileOpen(false); // Close sidebar on click (Mobile)
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-2xl lg:shadow-sm 
        flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* TOP: USER INFO (Matching Dashboard Initials Style) */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate text-sm">
                {user?.name || "Admin User"}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black text-indigo-600">
                {user?.role}
              </div>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
            <MdClose size={24} />
          </button>
        </div>

        {/* MENU CONTENT */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {dashboardItem && <MenuItem item={dashboardItem} activeSection={activeSection} onClick={() => goTo(dashboardItem.section)} />}
          {employeeItem && <MenuItem item={employeeItem} activeSection={activeSection} onClick={() => goTo(employeeItem.section)} />}

          {showPayrun && (
            <div className="py-1">
              <button
                onClick={() => setPayrunOpen(!payrunOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <MdPayments className="text-xl" />
                  <span className="font-bold text-sm">Payrun</span>
                </div>
                {payrunOpen ? <MdExpandLess /> : <MdExpandMore />}
              </button>

              {payrunOpen && (
                <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100">
                  {payrunMenu.map((sub) => (
                    <div
                      key={sub.section}
                      onClick={() => goTo(sub.section)}
                      className={`pl-4 py-2 text-sm cursor-pointer transition rounded-r-xl
                        ${activeSection === sub.section ? "text-indigo-600 font-black bg-indigo-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                      `}
                    >
                      {sub.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {otherItems.map((item) => (
            <MenuItem key={item.section} item={item} activeSection={activeSection} onClick={() => goTo(item.section)} />
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition font-bold text-sm"
          >
            <MdLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function MenuItem({ item, activeSection, onClick }) {
  const isActive = activeSection === item.section;
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition group
        ${isActive ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50" : "text-slate-600 hover:bg-slate-50"}
      `}
    >
      <span className={`text-xl ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
        {item.icon}
      </span>
      <span className={`text-sm font-bold ${isActive ? "font-black" : ""}`}>
        {item.label}
      </span>
    </div>
  );
}