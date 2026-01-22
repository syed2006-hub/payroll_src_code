export default function Dashboard() {
  const stats = [
    { label: "Total Users", value: "152" },
    { label: "Roles Defined", value: "5" },
    { label: "Active Sessions", value: "27" },
    { label: "System Alerts", value: "3" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.label} className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">System Overview</h2>
        <p className="text-gray-600 text-sm">
          Monitor the health of the system, check alerts, and manage users and roles.
        </p>
      </div>
    </div>
  );
}
