// src/hr_component/layout/HrAdminLayout.jsx
import React, { useState } from "react";
import HrSidebar from "../components/HrSidebar";
import Header from "../components/Header";

// Pages
import Dashboard from "../pages/hr/Dashboard";
import EmployeeManagement from "../pages/hr/EmployeeManagement";
import SalaryStructure from "../pages/hr/SalaryStructure";
import Attendance from "../pages/hr/Attendance";
import Reports from "../pages/hr/Reports";

export default function HrAdminLayout() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    const pages = {
      "Employee Management": <EmployeeManagement />,
      "Salary Structure": <SalaryStructure />,
      Attendance: <Attendance />,
      Reports: <Reports />,
    };
    return pages[activePage] || <Dashboard />;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <HrSidebar activeItem={activePage} onSelect={setActivePage} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header title={activePage} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
