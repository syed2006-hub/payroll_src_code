export default function Notifications() {
  const notifications = [
    "Payslip for March generated",
    "Tax declaration submitted",
    "Bank details verified",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <ul className="space-y-2 text-gray-600 text-sm">
        {notifications.map((n, idx) => (
          <li key={idx}>• {n}</li>
        ))}
      </ul>
    </div>
  );
}
