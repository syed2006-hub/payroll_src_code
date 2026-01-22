// src/finance_component/layout/FinanceLayout.jsx
import React, { useState } from "react";
import FinanceSidebar from "../components/FinanceSidebar";
import Header from "../components/Header";

// Finance pages
import Dashboard from "../pages/finance/Dashboard";
import FinancialReports from "../pages/finance/FinancialReports";
import Audits from "../pages/finance/Audits";
import ExportData from "../pages/finance/ExportData";

export default function FinanceLayout() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    const pages = {
      "Financial Reports": <FinancialReports />,
      Audits: <Audits />,
      "Export Data": <ExportData />,
    };
    return pages[activePage] || <Dashboard />;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <FinanceSidebar activeItem={activePage} onSelect={setActivePage} />

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
