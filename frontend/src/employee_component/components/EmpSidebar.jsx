import { useContext } from "react";
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
  "Dashboard",
  "Payslips",
  "Tax Declarations",
  "Documents",
  "Notifications",
  "Profile",
  "Settings",
];

const icons = {
  Dashboard: <MdDashboard />,
  Payslips: <MdReceiptLong />,
  "Tax Declarations": <MdDescription />,
  Documents: <MdFolder />,
  Notifications: <MdNotifications />,
  Profile: <MdPerson />,
  Settings: <MdSettings />,
};

export default function EmpSidebar({ activeItem, onSelect }) {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">
      
      {/* Top: Employee Portal + Menu */}
      <div>
        <div className="p-6 text-xl font-bold text-blue-600">
          Employee Portal
        </div>

        <nav className="px-4 space-y-1">
          {menu.map((item) => (
            <div
              key={item}
              onClick={() => onSelect(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  activeItem === item
                    ? "bg-blue-100 text-blue-600"
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

      {/* Bottom: Logout */}
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
