import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdDashboard,
  MdReceiptLong,
  MdDescription,
  MdFolder,
  MdNotifications,
  MdPerson,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

const menu = [
  { label: "Dashboard", section: "dashboard", icon: <MdDashboard /> },
  { label: "Payslips", section: "payslips", icon: <MdReceiptLong /> },
  { label: "Tax Declarations", section: "tax", icon: <MdDescription /> },
  { label: "Documents", section: "documents", icon: <MdFolder /> },
  { label: "Notifications", section: "notifications", icon: <MdNotifications /> },
  { label: "Profile", section: "profile", icon: <MdPerson /> },
  { label: "Settings", section: "settings", icon: <MdSettings /> },
];

export default function EmpSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeSection = searchParams.get("section") || "dashboard";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">
      <div>
        <div className="p-6 text-xl font-bold text-blue-600">
          Employee Portal
        </div>

        <nav className="px-4 space-y-1">
          {menu.map((item) => (
            <div
              key={item.section}
              onClick={() =>
                navigate(`/employee?section=${item.section}`)
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  activeSection === item.section
                    ? "bg-blue-100 text-blue-600"
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
        >
          <MdLogout className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
