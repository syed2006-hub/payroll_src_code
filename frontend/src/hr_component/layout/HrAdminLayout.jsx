// src/hr_component/layout/HrAdminLayout.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import HrSidebar from "../components/HrSidebar";
import Header from "../components/Header";

// Pages
import Dashboard from "../pages/hr/Dashboard";
import EmployeeManagement from "../pages/hr/EmployeeManagement";
import SalaryStructure from "../pages/hr/SalaryStructure";
import Attendance from "../pages/hr/Attendance";
import Reports from "../pages/hr/Reports";

export default function HrAdminLayout() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "dashboard";

  const renderPage = () => {
    switch (section) {
      case "employee":
        return <EmployeeManagement />;
      case "salary":
        return <SalaryStructure />;
      case "attendance":
        return <Attendance />;
      case "reports":
        return <Reports />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const titleMap = {
    dashboard: "Dashboard",
    employee: "Employee Management",
    salary: "Salary Structure",
    attendance: "Attendance",
    reports: "Reports",
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <HrSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header title={titleMap[section]} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
