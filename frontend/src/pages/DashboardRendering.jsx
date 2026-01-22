import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import EmployeeLayout from '../employee_component/layout/EmployeeLayout';
import SuperAdminLayout from '../super_admin_component/layout/SuperAdminLayout';
import HrAdminLayout from '../hr_component/layout/HrAdminLayout';
import FinanceLayout from '../finance_component/layout/FinanceLayout';
import PayrollAdminLayout from '../payroll_component/layout/PayrollAdminLayout';

const DashboardRendering = () => {
  const { user } = useContext(AuthContext);

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'Super Admin':
        return (
          <SuperAdminLayout/>
        );
      case 'Payroll Admin':
        return (
          < PayrollAdminLayout />
        );
      case 'HR Admin':
        return (
          < HrAdminLayout/>
        );
      case 'Employee':
        return (
          <EmployeeLayout/>
        );
      case 'Finance':
        return (
          < FinanceLayout />
        );
      default:
        return <p>Welcome!</p>;
    }
  };

  return (
    <div className="flex"> 
      <div className="flex-1 bg-gray-50 p-8">
        {getDashboardContent()}
      </div>
    </div>
  );
};

export default DashboardRendering;