// src/super_admin/layout/SuperAdminLayout.jsx
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import SuperAdminSidebar from "../components/SuperAdminSidebar";
import Header from "../components/Header";

// Pages
import Dashboard from "../pages/super_admin/Dashboard";
import UserManagement from "../../pages/usermanagement/UserManagement";
import Roles from "../pages/super_admin/Roles"; 
import Reports from "../pages/super_admin/Reports";
import Settings from "../pages/super_admin/Settings"; 

export default function SuperAdminLayout() {
  const [searchParams] = useSearchParams();

  // ✅ MOBILE SIDEBAR STATE (THE MISSING PIECE)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const section = searchParams.get("section") || "dashboard";
  const operation = searchParams.get("operation") || "view";
  const id = searchParams.get("id");

  const renderPage = () => {
    switch (section) {
      case "users":
        return <UserManagement operation={operation} id={id} />;
      case "roles":
        return <Roles />; 
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />; 
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const titleMap = {
    dashboard: "Dashboard",
    users: "User Management",
    roles: "Roles", 
    reports: "Reports",
    settings: "Settings", 
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* ✅ SIDEBAR */}
      <SuperAdminSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        
        {/* ✅ HEADER */}
        <Header
          title={titleMap[section]}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
