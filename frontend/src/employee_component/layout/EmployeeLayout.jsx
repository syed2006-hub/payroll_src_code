import { useSearchParams } from "react-router-dom";
import EmpSidebar from "../components/EmpSidebar";
import Header from "../components/Header";

// Pages
import Dashboard from "../pages/employee/Dashboard";
import Payslips from "../pages/employee/Payslips";
import TaxDeclarations from "../pages/employee/TaxDeclarations";
import Documents from "../pages/employee/Documents";
import Notifications from "../pages/employee/Notifications";
import Profile from "../pages/employee/Profile";
import Settings from "../pages/employee/Settings";

export default function EmployeeLayout() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "dashboard";

  const renderPage = () => {
    switch (section) {
      case "payslips":
        return <Payslips />;
      case "tax":
        return <TaxDeclarations />;
      case "documents":
        return <Documents />;
      case "notifications":
        return <Notifications />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const titleMap = {
    dashboard: "Dashboard",
    payslips: "Payslips",
    tax: "Tax Declarations",
    documents: "Documents",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings",
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <EmpSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header title={titleMap[section]} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
