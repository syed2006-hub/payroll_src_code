import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Users, CreditCard, Clock, Activity, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllLegend, setShowAllLegend] = useState(false); // <-- NEW STATE

  const COLORS = ['#2A9D8F', '#264653', '#E9C46A', '#F4A261', '#E76F51'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/superadmin/dashboardsummary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (loading) return <div className="p-10 text-gray-500">Loading Dashboard...</div>;
  if (!data) return <div className="p-10 text-red-500">Failed to load data</div>;

  const formatFullCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Limit department legend to first 5 if showAllLegend is false
  const legendToShow = showAllLegend ? data.departmentStats : data.departmentStats.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Employees"
          value={data.overview.totalEmployees}
          subtext="Active on payroll"
          trend="+12%" // You can calculate this real-time if needed by comparing last month in array
          trendText="from last month"
          icon={<Users size={22} className="text-indigo-600" />}
          bgIcon="bg-indigo-100"
        />
        <StatCard 
          label="Monthly Payroll"
          value={formatFullCurrency(data.overview.totalPayroll)}
          subtext="This month's total"
          trend="+3.5%"
          trendText="from last month"
          icon={<CreditCard size={22} className="text-teal-600" />}
          bgIcon="bg-teal-100"
        />
        <StatCard 
          label="Pending Approvals"
          value={data.overview.pendingApprovals}
          subtext="Awaiting action"
          icon={<Clock size={22} className="text-orange-600" />}
          bgIcon="bg-orange-100"
        />
        <StatCard 
          label="Avg. Salary"
          value={formatFullCurrency(data.overview.avgSalary)}
          subtext="Per employee"
          icon={<Activity size={22} className="text-green-600" />}
          bgIcon="bg-green-100"
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- REAL PAYROLL TREND CHART --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Payroll Trend</h2>
              <p className="text-sm text-gray-500">Last 6 months overview</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              <Calendar size={16} />
              FY 2024-25
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Using data.payrollTrend from your REAL backend */}
              <AreaChart data={data.payrollTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A9D8F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2A9D8F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  dy={10}
                />
                
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  // Formatter updated to show "₹8L" or "₹10L" like the image
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  width={80} // Added width to prevent text cutoff
                />
                
                <Tooltip 
                  formatter={(val) => [formatFullCurrency(val), "Payroll"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="payroll" 
                  stroke="#2A9D8F" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPay)" 
                  activeDot={{ r: 6, strokeWidth: 0 }} // Clean active dot
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- DEPARTMENT PIE CHART --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">By Department</h2>
          <p className="text-sm text-gray-500">Headcount distribution</p>
        </div>

        <div className="h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.departmentStats}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.departmentStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="space-y-3 mt-2">
          {legendToShow.map((dept, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-gray-600 truncate max-w-[150px]">{dept.name}</span>
              </div>
              <span className="font-semibold text-gray-800">{dept.value}</span>
            </div>
          ))}

          {data.departmentStats.length > 5 && (
            <button
              onClick={() => setShowAllLegend(!showAllLegend)}
              className="mt-2 text-sm text-indigo-600 hover:underline"
            >
              {showAllLegend ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>

      </div>
    </div>
  );
}

// Reusable Card Component
function StatCard({ label, value, subtext, trend, trendText, icon, bgIcon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
          <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgIcon}`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded mr-2">
            {trend}
          </span>
          <span className="text-gray-400 text-xs">{trendText}</span>
        </div>
      )}
    </div>
  );
}