// src/finance_component/layout/FinanceLayout.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import FinanceSidebar from "../components/FinanceSidebar";
import Header from "../components/Header";

// Finance pages
import Dashboard from "../pages/finance/Dashboard";
import FinancialReports from "../pages/finance/FinancialReports";
import Audits from "../pages/finance/Audits";
import ExportData from "../pages/finance/ExportData";

export default function FinanceLayout() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "dashboard";

  const renderPage = () => {
    switch (section) {
      case "reports":
        return <FinancialReports />;
      case "audits":
        return <Audits />;
      case "export":
        return <ExportData />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const titleMap = {
    dashboard: "Dashboard",
    reports: "Financial Reports",
    audits: "Audits",
    export: "Export Data",
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <FinanceSidebar />

      <div className="flex-1 ml-64 flex flex-col min-w-0 overflow-hidden">
        <Header title={titleMap[section]} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
