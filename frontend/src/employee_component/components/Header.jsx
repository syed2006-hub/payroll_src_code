import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext"; 
import { MdMenu, MdNotificationsNone, MdAccessTime } from "react-icons/md";

export default function Header({ title, onMenuClick }) {
  const { user } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 md:h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
      
      <div className="flex items-center gap-3">
        {/* HAMBURGER BUTTON: Visible only on mobile/tablet */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-all active:scale-90"
        >
          <MdMenu size={28} />
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight leading-none">
            {title}
          </h1>
          <span className="hidden md:block text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
            Employee Portal
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Time and Role */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right leading-none border-r border-slate-200 pr-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Current Time</p>
          <p className="text-xs font-bold text-slate-700">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-black text-slate-800 leading-none">{user?.name?.split(' ')[0]}</p>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}