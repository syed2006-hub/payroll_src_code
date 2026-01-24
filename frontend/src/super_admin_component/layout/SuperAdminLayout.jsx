import { useSearchParams } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import Header from "../components/Header";

// Pages
import Dashboard from "../pages/super_admin/Dashboard"; 
import UserManagement from "../../pages/usermanagement/UserManagement";
import Roles from "../pages/super_admin/Roles";
import Permissions from "../pages/super_admin/Permissions";
import Reports from "../pages/super_admin/Reports";
import Settings from "../pages/super_admin/Settings";
import Logs from "../pages/super_admin/Logs";

export default function SuperAdminLayout() {
  const [searchParams] = useSearchParams();

  const section = searchParams.get("section") || "dashboard";
  const operation = searchParams.get("operation") || "view";
  const id = searchParams.get("id");

  const renderPage = () => {
    switch (section) {
      case "users":
        return <UserManagement operation={operation} id={id} />;

      case "roles":
        return <Roles />;

      case "permissions":
        return <Permissions />;

      case "reports":
        return <Reports />;

      case "settings":
        return <Settings />;

      case "logs":
        return <Logs />;

      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const titleMap = {
    dashboard: "Dashboard",
    users: "User Management",
    roles: "Roles",
    permissions: "Permissions",
    reports: "Reports",
    settings: "Settings",
    logs: "Logs",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SuperAdminSidebar activeSection={section} />

      <div className="flex-1 ml-64 flex flex-col">
        <Header title={titleMap[section]} />
        <main className="flex-1 p-6 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  );
}
