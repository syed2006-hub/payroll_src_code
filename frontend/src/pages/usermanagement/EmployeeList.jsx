import { useEffect, useState } from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchEmployees = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not logged in");

    const res = await fetch("http://localhost:5000/api/users", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch employees");
    }

    const result = await res.json();
    setEmployees(result.data);
  } catch (err) {
    console.error("Fetch failed", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchEmployees();
}, []);

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      setEmployees(prev => prev.filter(emp => emp._id !== id));
      alert("Employee deleted successfully");
    }
  };
  console.log(loading);
  
  if (loading) return <div className="p-8">Loading employees...</div>;
  console.log(employees)
  return (
    
    
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Employee Name</th>
            <th className="px-6 py-4">Employee ID</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {employees.map((emp) => (
            <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium">{emp.name || `${emp.basic?.firstName} ${emp.basic?.midle} ${emp.basic?.lastName}`}</td>
              <td className="px-6 py-4">{emp.employeeDetails?.basic?.employeeId || "N/A"}</td>
              <td className="px-6 py-4">{emp.email}</td>
              <td className="px-6 py-4">
                 <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                   {emp.role}
                 </span>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => deleteEmployee(emp._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;