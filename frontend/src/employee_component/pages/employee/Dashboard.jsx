import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../../context/AuthContext";



import KpiCard from '../../../components/kpiCard.jsx';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        // ⛔ API NOT READY YET – PLACEHOLDER
        // const res = await fetch(`${API_URL}/api/employee/dashboard`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const data = await res.json();

        // setPayslips(data.payslips || []);
        // setAttendanceSummary(data.attendanceSummary || null);

      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

 


  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">
          Welcome, {user?.name || 'Employee'}
        </h2>
        <p className="text-sm text-text-secondary">
          Here’s a summary of your payroll information
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Net Pay (This Month)"
          value={
           0
          }
          subtitle={
            "NILL"
          }
          accent="green"
        />

        <KpiCard
          title="Gross Salary"
          value={
            0
          }
          subtitle="Before deductions"
          accent="primary"
        />

        <KpiCard
          title="Total Deductions"
          value={
            0
          }
          subtitle="PF, PT & TDS"
          accent="red"
        />

        <KpiCard
          title="Payslips Available"
          
          subtitle="Last months"
          accent="orange"
        />
      </div>

      
    </div>
  );
}
