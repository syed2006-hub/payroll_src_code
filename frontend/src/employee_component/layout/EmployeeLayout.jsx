import { useState,useContext } from "react";
import EmpSidebar from "../components/EmpSidebar";
import Header from "../components/Header";

// Employee pages
import Dashboard from "../pages/employee/Dashboard";
import Payslips from "../pages/employee/Payslips";
import TaxDeclarations from "../pages/employee/TaxDeclarations";
import Documents from "../pages/employee/Documents";
import Notifications from "../pages/employee/Notifications";
import Profile from "../pages/employee/Profile";
import Settings from "../pages/employee/Settings";  

export default function EmployeeLayout() { 
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    const pages = {
      "Payslips": <Payslips />,
      "Tax Declarations": <TaxDeclarations />,
      "Documents": <Documents />,
      "Notifications": <Notifications />,
      "Profile": <Profile />,
      "Settings": <Settings />,
    };
    return pages[activePage] || <Dashboard />;
  };

  return (
    // 1. H-screen + overflow-hidden prevents the whole window from scrolling awkwardly
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* 2. Sidebar - Ensure it has a fixed width and doesn't shrink */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:block">
        <EmpSidebar activeItem={activePage} onSelect={setActivePage} />
      </aside>

      {/* 3. Main Content Wrapper */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        
        {/* Header - Stays at the top */}
        <Header title={activePage} />

        {/* 4. Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto"> 
            {/* max-w-7xl keeps content from stretching too far on wide screens */}
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}