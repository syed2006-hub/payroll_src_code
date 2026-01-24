// src/payroll_component/components/PayrollSidebar.jsx
import React, { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdPlayCircleFilled,
  MdCheckCircle,
  MdHistory,
  MdAssessment,
  MdLogout,
} from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

const menu = [
  { label: "Dashboard", section: "dashboard", icon: <MdDashboard /> },
  { label: "Employee Payroll", section: "employee", icon: <MdPeople /> },
  { label: "Payroll Run", section: "run", icon: <MdPlayCircleFilled /> },
  { label: "Payroll Approval", section: "approval", icon: <MdCheckCircle /> },
  { label: "Payroll History", section: "history", icon: <MdHistory /> },
  { label: "Reports", section: "reports", icon: <MdAssessment /> },
];

export default function PayrollSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeSection = searchParams.get("section") || "dashboard";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">
      {/* Top */}
      <div>
        <div className="p-6 text-xl font-bold text-teal-600">Payroll Admin</div>

        <nav className="px-4 space-y-1">
          {menu.map(({ label, section, icon }) => (
            <div
              key={section}
              onClick={() => navigate(`/payrolladmin?section=${section}`)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  activeSection === section
                    ? "bg-teal-100 text-teal-600"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-xl">{icon}</span>
              <span className="font-medium">{label}</span>
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
