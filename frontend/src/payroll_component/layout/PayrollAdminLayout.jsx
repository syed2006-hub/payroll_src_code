// src/payroll_component/layout/PayrollAdminLayout.jsx
import React, { useState } from "react";
import PayrollSidebar from "../components/PayrollSidebar";
import Header from "../components/Header";

// Pages
import Dashboard from "../pages/payroll/Dashboard";
import EmployeePayroll from "../pages/payroll/EmployeePayroll";
import PayrollRun from "../pages/payroll/PayrollRun";
import PayrollApproval from "../pages/payroll/PayrollApproval";
import PayrollHistory from "../pages/payroll/PayrollHistory";
import Reports from "../pages/payroll/Reports";

export default function PayrollAdminLayout() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    const pages = {
      "Employee Payroll": <EmployeePayroll />,
      "Payroll Run": <PayrollRun />,
      "Payroll Approval": <PayrollApproval />,
      "Payroll History": <PayrollHistory />,
      Reports: <Reports />,
    };
    return pages[activePage] || <Dashboard />;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <PayrollSidebar activeItem={activePage} onSelect={setActivePage} />

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
