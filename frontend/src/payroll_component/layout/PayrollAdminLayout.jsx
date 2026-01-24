// src/payroll_component/layout/PayrollAdminLayout.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "dashboard";

  const renderPage = () => {
    switch (section) {
      case "employee":
        return <EmployeePayroll />;
      case "run":
        return <PayrollRun />;
      case "approval":
        return <PayrollApproval />;
      case "history":
        return <PayrollHistory />;
      case "reports":
        return <Reports />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const titleMap = {
    dashboard: "Dashboard",
    employee: "Employee Payroll",
    run: "Payroll Run",
    approval: "Payroll Approval",
    history: "Payroll History",
    reports: "Reports",
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <PayrollSidebar />

      <div className="flex-1 ml-64 flex flex-col min-w-0 overflow-hidden">
        <Header title={titleMap[section]} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
