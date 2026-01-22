import React, { useContext } from "react";
import {
  MdDashboard,
  MdPeople,
  MdSecurity,
  MdVerifiedUser,
  MdAssessment,
  MdSettings,
  MdHistory,
  MdLogout,
} from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

const menu = [
  "Dashboard",
  "User Management",
  "Roles",
  "Permissions",
  "Reports",
  "Settings",
  "Logs",
];

const icons = {
  Dashboard: <MdDashboard />,
  "User Management": <MdPeople />,
  Roles: <MdSecurity />,
  Permissions: <MdVerifiedUser />,
  Reports: <MdAssessment />,
  Settings: <MdSettings />,
  Logs: <MdHistory />,
};

export default function SuperAdminSidebar({ activeItem, onSelect }) {
  const { user, logout } = useContext(AuthContext); // ✅ useContext now works

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">
      
      {/* Top menu */}
      <div>
        <div className="p-6 text-xl font-bold text-purple-600">
          Super Admin
        </div>

        <nav className="px-4 space-y-1">
          {menu.map((item) => (
            <div
              key={item}
              onClick={() => onSelect(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  activeItem === item
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-xl">{icons[item]}</span>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <MdLogout className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
