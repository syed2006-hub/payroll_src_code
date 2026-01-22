import { useState } from "react";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import Header from "../components/Header";

// Super Admin pages
import Dashboard from "../pages/super_admin/Dashboard";
import UserManagement from "../pages/super_admin/UserManagement";
import Roles from "../pages/super_admin/Roles";
import Permissions from "../pages/super_admin/Permissions";
import Reports from "../pages/super_admin/Reports";
import Settings from "../pages/super_admin/Settings";
import Logs from "../pages/super_admin/Logs";

export default function SuperAdminLayout() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "User Management":
        return <UserManagement />;
      case "Roles":
        return <Roles />;
      case "Permissions":
        return <Permissions />;
      case "Reports":
        return <Reports />;
      case "Settings":
        return <Settings />;
      case "Logs":
        return <Logs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SuperAdminSidebar activeItem={activePage} onSelect={setActivePage} />

      <div className="flex-1 ml-64 flex flex-col">
        <Header title={activePage} />

        <main className="flex-1 p-6 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  );
}
