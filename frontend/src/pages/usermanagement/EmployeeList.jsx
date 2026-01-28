  import { useEffect, useState } from "react";

  const ITEMS_PER_PAGE = 5;

  const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("All");

    /* ===================== FETCH EMPLOYEES ===================== */
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const res = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch employees");

        const result = await res.json();
        const data = Array.isArray(result.data) ? result.data : [];

        setEmployees(data);
        // We don't setFilteredEmployees here anymore, the useEffect below handles it
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchEmployees();
    }, []);

    /* ===================== FILTER LOGIC ===================== */
    // This effect runs whenever the active tab changes OR the raw employees data changes
    useEffect(() => {
      setCurrentPage(1);

      if (activeTab === "All") {
        setFilteredEmployees(employees);
      } else {
        setFilteredEmployees(
          employees.filter((e) => e.status === activeTab)
        );
      }
    }, [activeTab, employees]);

    /* ===================== HELPERS ===================== */
    // Calculate counts dynamically based on current data
    const getTabCounts = () => {
      const activeCount = employees.filter((e) => e.status === "Active").length;
      const inactiveCount = employees.filter((e) => e.status === "Inactive").length;
      return {
        All: employees.length,
        Active: activeCount,
        Inactive: inactiveCount,
      };
    };

    const counts = getTabCounts();
    const tabs = ["All", "Active", "Inactive"];

    /* ===================== ACTIONS ===================== */
    const toggleStatus = async (id, currentStatus) => {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      
      // 1. Optimistic UI Update (Update local state immediately)
      setEmployees((prev) => 
        prev.map((emp) => 
          emp._id === id ? { ...emp, status: newStatus } : emp
        )
      );

      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/users/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        // No need to fetchEmployees() again; local state update handles the UI reflow
      } catch (error) {
        console.error("Status update failed", error);
        // Revert if API fails (optional, but good practice)
        fetchEmployees(); 
      }
    };

    const deleteEmployee = async (id) => {
      if (!window.confirm("Are you sure you want to delete this employee?")) return;

      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Remove from local state immediately
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      } catch (error) {
        console.error("Delete failed", error);
      }
    };

    /* ===================== PAGINATION ===================== */
    const totalEmployees = filteredEmployees.length;
    const totalPages = Math.ceil(totalEmployees / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedEmployees = filteredEmployees.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    const getPaginationGroup = () => {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
      if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    const paginationGroup = getPaginationGroup();

    if (loading) return <div className="p-8">Loading employees...</div>;

    /* ===================== UI ===================== */
    return (
      
      <div className="p-6 bg-gray-50 h-full overflow-hidden flex flex-col">

        <h2 className="text-2xl font-bold mb-1">Employee Directory</h2>
        <p className="text-gray-500 mb-6">
          View and manage employees in your organization.
        </p>

        {/* Tabs */}
        <div className="flex gap-6 bg-white p-3 border rounded-lg mb-6 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
                <tr>
                  {/* Defined widths to force alignment */}
                  <th className="px-6 py-4 w-[25%]">Employee Name</th>
                  <th className="px-6 py-4 w-[15%]">Employee ID</th>
                  <th className="px-6 py-4 w-[15%]">Department</th>
                  <th className="px-6 py-4 w-[15%]">Role</th>
                  <th className="px-6 py-4 w-[15%] text-center">Status</th>
                  <th className="px-6 py-4 w-[15%] text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                          {emp.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{emp.name}</div>
                          <div className="text-xs text-gray-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {emp.employeeDetails?.basic?.employeeId || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {emp.employeeDetails?.basic?.department || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                          {emp.role || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleStatus(emp._id, emp.status)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                          ${
                            emp.status === "Active"
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          }`}
                      >
                        {emp.status || "Active"}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => deleteEmployee(emp._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Employee"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedEmployees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 italic">
                      No employees found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalEmployees > 0 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, totalEmployees)}</span> of{" "}
                <span className="font-medium">{totalEmployees}</span> results
              </p>

              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  ‹
                </button>

                {paginationGroup.map((item, i) => (
                  <button
                    key={i}
                    disabled={item === "..."}
                    onClick={() => typeof item === "number" && setCurrentPage(item)}
                    className={`min-w-[32px] h-8 rounded border text-sm font-medium
                      ${
                        currentPage === item
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                      }
                      ${item === "..." ? "border-none bg-transparent cursor-default" : ""}`}
                  >
                    {item}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default EmployeeList;