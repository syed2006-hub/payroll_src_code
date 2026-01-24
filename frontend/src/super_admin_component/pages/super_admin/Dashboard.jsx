import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/superadmin/dashboardsummary",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const stats = [
    { label: "Total Users", value: data.totalUsers },
    { label: "Active Users", value: data.activeUsers }
  ];

  return (
    <div className="space-y-6">

      {/* 🔢 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white p-5 rounded-xl shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 🏢 System Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-3">System Overview</h2>

        <p className="text-sm text-gray-700">
          <span className="font-medium">Organization:</span>{" "}
          {data.organizationName}
        </p>
      </div>
    </div>
  );
}
