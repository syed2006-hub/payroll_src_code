import { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MdMenu, MdAdd, MdNotificationsNone, MdChevronRight, MdAccessTime } from "react-icons/md";

export default function Header({ title, setIsMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  
  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const operation = searchParams.get("operation") || "view";
  const section = searchParams.get("section") || "dashboard";
  
  const showAddButton = section === "users" && ["list", "view", "default"].includes(operation);  
  const roleToPath = (role) => role?.toLowerCase().replace(/\s+/g, "") || "";

  const goToAdd = () => {
    navigate(`/payroll/${roleToPath(user?.role)}?section=users&operation=add`);
  };

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl saturate-150 border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm shadow-slate-100">
      
      {/* LEFT: Menu Trigger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl text-slate-500 transition-all active:scale-90"
        >
          <MdMenu size={28} />
        </button>
        
        <div className="flex flex-col">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">
            <span className="hover:text-indigo-600 cursor-default transition-colors">Payroll</span>
            <MdChevronRight size={14} className="text-slate-300" />
            <span className="text-indigo-500">{section}</span>
          </div>
          
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">
            {title}
          </h1>
        </div>
      </div>

      {/* CENTER/RIGHT: Live Clock (Hidden on very small screens) */}
      <div className="hidden xl:flex items-center gap-3 px-5 py-2 bg-slate-50/50 border border-slate-100 rounded-2xl">
        <MdAccessTime className="text-indigo-500" size={18} />
        <div className="flex flex-col leading-none">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Current Period</span>
          <span className="text-xs font-bold text-slate-700 mt-1">
            {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })} • 
            <span className="ml-1 text-indigo-600 uppercase">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </span>
          </span>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 md:gap-5 ml-auto md:ml-0">
        {showAddButton && (
          <button
            onClick={goToAdd}
            className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-2xl text-xs md:text-sm font-black flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            {/* Subtle light sweep effect on hover */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:animate-[sweep_0.6s_ease-in-out]" />
            <MdAdd size={20} />
            <span className="hidden sm:inline">Add Employee</span>
          </button>
        )}

        {/* Notification Hub */}
        <button className="relative p-3 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 rounded-2xl transition-all shadow-sm group">
          <MdNotificationsNone size={26} className="group-hover:animate-bounce" />
          <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
          </span>
        </button>

        {/* User Mini Avatar (Optional extra touch) */}
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 hidden md:flex items-center justify-center font-black text-slate-500 text-xs shadow-inner">
          {user?.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
        </div>
      </div> 
    </header>
  );
}