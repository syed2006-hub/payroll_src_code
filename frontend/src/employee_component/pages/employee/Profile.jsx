export default function Profile() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>
      <div className="text-gray-600 text-sm">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john.doe@example.com</p>
        <p><strong>Department:</strong> Finance</p>
        <p><strong>Role:</strong> Employee</p>
      </div>
    </div>
  );
}
