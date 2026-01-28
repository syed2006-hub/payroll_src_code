import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";


import Register from "./pages/Register";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Unauthorized from "./pages/Unauthorized";


import SuperAdminLayout from "./super_admin_component/layout/SuperAdminLayout";
import HrAdminLayout from "./hr_component/layout/HrAdminLayout"
import PayrollAdminLayout from "./payroll_component/layout/PayrollAdminLayout"
import FinanceLayout from "./finance_component/layout/FinanceLayout"
import EmployeeLayout from "./employee_component/layout/EmployeeLayout";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Super Admin Onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={["Super Admin"]}>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Portal */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={["Super Admin"]}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Hr Admin Portal */}
          <Route
            path="/hradmin"
            element={
              <ProtectedRoute allowedRoles={["HR Admin"]}>
                <HrAdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Payroll Admin Portal */}
          <Route
            path="/payrolladmin"
            element={
              <ProtectedRoute allowedRoles={["Payroll Admin"]}>
                <PayrollAdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Finance Admin Portal */}
          <Route
            path="/finance"
            element={
              <ProtectedRoute allowedRoles={["Finance"]}>
                <FinanceLayout />
              </ProtectedRoute>
            }
          />

          {/* Employee Portal */}
          <Route
            path="/employee"
            element={ 
              <ProtectedRoute allowedRoles={["Employee"]}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
