import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdDashboard, MdPeople, MdSecurity, MdVerifiedUser,
  MdAssessment, MdSettings, MdHistory, MdLogout,
} from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const menu = [
  { label: "Dashboard", section: "dashboard", icon: <MdDashboard /> },
  { label: "User Management", section: "users", icon: <MdPeople /> },
  { label: "Roles", section: "roles", icon: <MdSecurity /> },
  { label: "Permissions", section: "permissions", icon: <MdVerifiedUser /> },
  { label: "Reports", section: "reports", icon: <MdAssessment /> },
  { label: "Settings", section: "settings", icon: <MdSettings /> },
  { label: "Logs", section: "logs", icon: <MdHistory /> },
];

export default function SuperAdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeSection = searchParams.get("section") || "dashboard";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">
      <div>
        <div className="p-6 text-xl font-bold text-purple-600">
          Super Admin
        </div>

        <nav className="px-4 space-y-1">
          {menu.map((item) => (
            <div
              key={item.section}
              onClick={() => navigate(`/superadmin?section=${item.section}`)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  activeSection === item.section
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

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
