export default function Dashboard() {
  const stats = [
    { label: "Net Salary", value: "₹68,500" },
    { label: "Payslips", value: "24" },
    { label: "Tax Regime", value: "New" },
    { label: "Leaves Left", value: "12" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>✔ Payslip for March generated</li>
          <li>✔ Tax declaration submitted</li>
          <li>✔ Bank details verified</li>
          <li>✔ Profile updated</li>
        </ul>
      </div>
    </div>
  );
}
