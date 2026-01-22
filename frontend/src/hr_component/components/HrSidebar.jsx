// src/hr_component/components/HrSidebar.jsx
import React, { useContext } from "react";
import {
  MdDashboard,
  MdPeople,
  MdAttachMoney,
  MdEvent,
  MdAssessment,
  MdLogout,
} from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

const menu = [
  "Dashboard",
  "Employee Management",
  "Salary Structure",
  "Attendance",
  "Reports",
];

const icons = {
  Dashboard: <MdDashboard />,
  "Employee Management": <MdPeople />,
  "Salary Structure": <MdAttachMoney />,
  Attendance: <MdEvent />,
  Reports: <MdAssessment />,
};

export default function HrSidebar({ activeItem, onSelect }) {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">
      
      {/* Top */}
      <div>
        <div className="p-6 text-xl font-bold text-indigo-600">HR Admin</div>

        <nav className="px-4 space-y-1">
          {menu.map((item) => (
            <div
              key={item}
              onClick={() => onSelect(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  activeItem === item
                    ? "bg-indigo-100 text-indigo-600"
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

      {/* Logout */}
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
