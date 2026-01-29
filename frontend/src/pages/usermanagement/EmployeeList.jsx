import { useEffect, useState } from "react";
import { X, Eye, Trash2 } from "lucide-react"; // Assuming you have lucide-react, standard in modern stacks

const ITEMS_PER_PAGE = 5;

// Professional Tax Slabs
const P_TAX_SLABS = {
  "Tamil Nadu": [
    { limit: 12500, amount: 208 },
    { limit: 10000, amount: 171 },
    { limit: 7500,  amount: 108 },
    { limit: 5000,  amount: 51 },
    { limit: 3500,  amount: 22 },
    { limit: 0,     amount: 0 }
  ],
  "Default": [
    { limit: 10000, amount: 200 },
    { limit: 0, amount: 0 }
  ]
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [orgConfig, setOrgConfig] = useState(null); 
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryBreakdown, setSalaryBreakdown] = useState(null);

  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All");

  /* ===================== FETCH DATA ===================== */
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Organization Settings
      const orgRes = await fetch("http://localhost:5000/api/organization/settings", { headers });
      if (orgRes.ok) {
        const orgData = await orgRes.json();
        setOrgConfig(orgData);
      }

      // 2. Fetch Employees
      const empRes = await fetch("http://localhost:5000/api/users", { headers });
      if (empRes.ok) {
        const result = await empRes.json();
        setEmployees(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ===================== CALCULATION LOGIC ===================== */
  const calculateSalaryDetails = (employee) => {
    // 1. Inputs
    const ctc = employee.employeeDetails?.salary?.ctc || 0;
    console.log(ctc);
    
    const basicPercent = employee.employeeDetails?.salary?.basicPercentage || 50;
    
    // 2. Earnings Calculation
    const monthlyGross = ctc / 12;
    const basicSalary = monthlyGross * (basicPercent / 100);
    
    let hra = 0;
    let specialAllowance = 0;

    // HRA Logic from DB Config
    if (orgConfig?.statutoryConfig?.hra?.enabled) {
      const hraPercent = orgConfig.statutoryConfig.hra.percentageOfBasic || 50;
      hra = basicSalary * (hraPercent / 100);
    }

    // Special Allowance is the balancing figure to match Gross
    specialAllowance = monthlyGross - basicSalary - hra;
    if (specialAllowance < 0) specialAllowance = 0; // Safety check

    // 3. Deductions Calculation
    let pf = 0;
    let esi = 0;
    let pt = 0;
    let employerPF = 0;
    let employerESI = 0;

    if (orgConfig?.statutoryConfig) {
      const { pf: pfConfig, esi: esiConfig, professionalTax: ptConfig } = orgConfig.statutoryConfig;

      // PF
      if (pfConfig?.enabled) {
        pf = basicSalary * ((pfConfig.employeeContribution || 12) / 100);
        employerPF = basicSalary * ((pfConfig.employerContribution || 12) / 100);
      }

      // ESI (Eligible if Gross <= Limit)
      if (esiConfig?.enabled) {
        const wageLimit = esiConfig.wageLimit || 21000;
        if (monthlyGross <= wageLimit) {
          esi = monthlyGross * ((esiConfig.employeeContribution || 0.75) / 100);
          employerESI = monthlyGross * ((esiConfig.employerContribution || 3.25) / 100);
        }
      }

      // Professional Tax
      if (ptConfig?.enabled) {
        const stateName = ptConfig.state || "Default";
        const slabs = P_TAX_SLABS[stateName] || P_TAX_SLABS["Default"];
        const applicableSlab = slabs.find(slab => monthlyGross > slab.limit);
        pt = applicableSlab ? applicableSlab.amount : 0;
      }
    }

    return {
      ctc,
      monthlyGross,
      earnings: {
        basic: basicSalary,
        hra: hra,
        special: specialAllowance,
        total: monthlyGross
      },
      deductions: {
        pf: pf,
        esi: esi,
        pt: pt,
        total: pf + esi + pt
      },
      employerContributions: {
        pf: employerPF,
        esi: employerESI
      },
      netPay: monthlyGross - (pf + esi + pt)
    };
  };

  /* ===================== VIEW HANDLER ===================== */
  const handleViewSalary = (employee) => {
    const details = calculateSalaryDetails(employee);
    setSalaryBreakdown(details);
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setSalaryBreakdown(null);
  };

  /* ===================== FILTER LOGIC ===================== */
  useEffect(() => {
    setCurrentPage(1);
    const dataToFilter = employees || [];
    if (activeTab === "All") {
      setFilteredEmployees(dataToFilter);
    } else {
      setFilteredEmployees(dataToFilter.filter((e) => e.status === activeTab));
    }
  }, [activeTab, employees]);

  // Actions
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setEmployees(prev => prev.map(emp => emp._id === id ? { ...emp, status: newStatus } : emp));
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) { console.error(e); fetchData(); }
  };

  const deleteEmployee = async (id) => {
    if(!window.confirm("Delete employee?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }});
      setEmployees(prev => prev.filter(e => e._id !== id));
    } catch (e) { console.error(e); }
  };

  /* ===================== PAGINATION ===================== */
  const totalEmployees = filteredEmployees.length;
  const totalPages = Math.ceil(totalEmployees / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const getPaginationGroup = () => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
  if (currentPage >= totalPages - 3)
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};

  const paginationGroup = getPaginationGroup();
 // Using simplified or full logic from your original code

  if (loading) return <div className="p-8 text-gray-500">Loading payroll data...</div>;

  return (
    <div className="p-6 bg-gray-50 h-full overflow-hidden flex flex-col relative">
      <h2 className="text-2xl font-bold mb-1">Employee Directory</h2>
      <p className="text-gray-500 mb-6">Manage staff and view calculated salary breakdown.</p>

      {/* Tabs */}
      <div className="flex gap-6 bg-white p-3 border rounded-lg mb-6 shadow-sm">
        {["All", "Active", "Inactive"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} 
            className={`text-sm font-medium pb-2 ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-auto flex-1">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b">
              <tr>
                <th className="px-4 py-3 min-w-[180px]">Employee</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right bg-blue-50/50">Monthly Gross</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700 bg-gray-100">Net Pay</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedEmployees.map((emp) => {
                const { monthlyGross, netPay } = calculateSalaryDetails(emp);
                return (
                  <tr key={emp._id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewSalary(emp)} // Row Click triggers modal
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                          {emp.name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{emp.name}</div>
                          <div className="text-[10px] text-gray-400">{emp.employeeDetails?.basic?.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {emp.role}<br/>
                      <span className="text-[10px] text-gray-400">{emp.employeeDetails?.basic?.department}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 bg-blue-50/20">
                      {formatCurrency(monthlyGross)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800 bg-gray-50">
                      {formatCurrency(netPay)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(emp._id, emp.status); }} 
                        className={`px-2 py-0.5 rounded text-[10px] border ${emp.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {emp.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleViewSalary(emp); }} className="text-gray-400 hover:text-blue-600">
                         <Eye size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteEmployee(emp._id); }} className="text-gray-400 hover:text-red-600">
                         <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        {totalEmployees > 0 && (
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
            
            {/* Left: Showing count */}
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, totalEmployees)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{totalEmployees}</span>{" "}
              results
            </p>

            {/* Right: Pagination buttons */}
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                ‹
              </button>

              {/* Page numbers */}
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
                    ${
                      item === "..."
                        ? "border-none bg-transparent cursor-default"
                        : ""
                    }
                  `}
                >
                  {item}
                </button>
              ))}

              {/* Next */}
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

      {/* ===================== SALARY BREAKDOWN MODAL ===================== */}
      {selectedEmployee && salaryBreakdown && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-lg">
                  {selectedEmployee.name?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.employeeDetails?.basic?.designation || selectedEmployee.role} • {selectedEmployee.employeeDetails?.basic?.department}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    PAN: {selectedEmployee.employeeDetails?.personal?.pan || "N/A"}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="font-semibold text-gray-800">Salary Breakdown</h4>
              </div>

              {/* Grid: Earnings vs Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Earnings Column */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-green-700">Earnings</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Basic Salary</span>
                      <span className="font-medium text-gray-900">{formatCurrency(salaryBreakdown.earnings.basic)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>HRA</span>
                      <span className="font-medium text-gray-900">{formatCurrency(salaryBreakdown.earnings.hra)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Special Allowance</span>
                      <span className="font-medium text-gray-900">{formatCurrency(salaryBreakdown.earnings.special)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Other Earnings</span>
                      <span className="font-medium text-gray-900">₹0</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-gray-800 mt-2">
                      <span>Total Earnings</span>
                      <span className="text-green-700">{formatCurrency(salaryBreakdown.earnings.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions Column */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-semibold text-red-700">Deductions</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>PF (Employee)</span>
                      <span className="font-medium text-gray-900">{formatCurrency(salaryBreakdown.deductions.pf)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>ESI (Employee)</span>
                      <span className="font-medium text-gray-900">{formatCurrency(salaryBreakdown.deductions.esi)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Professional Tax</span>
                      <span className="font-medium text-gray-900">{formatCurrency(salaryBreakdown.deductions.pt)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Income Tax (TDS)</span>
                      <span className="font-medium text-gray-900">₹0</span> {/* Placeholder as TDS logic isn't in Prompt */}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-gray-800 mt-2">
                      <span>Total Deductions</span>
                      <span className="text-red-600">{formatCurrency(salaryBreakdown.deductions.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Box */}
              <div className="mt-8 bg-blue-50/50 rounded-lg p-4 border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Net Pay (Monthly)</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(salaryBreakdown.netPay)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Annual CTC</p>
                  <p className="text-lg font-semibold text-gray-800">{formatCurrency(salaryBreakdown.ctc)}</p>
                </div>
              </div>

              {/* Footer: Employer Contributions */}
              <div className="mt-4 pt-4 border-t text-xs text-gray-500 flex gap-6">
                <span className="font-medium text-gray-400">Employer Contributions:</span>
                <span>PF: <span className="text-gray-700 font-medium">{formatCurrency(salaryBreakdown.deductions.pf)}</span></span>
                <span>ESI: <span className="text-gray-700 font-medium">{formatCurrency(salaryBreakdown.deductions.esi)}</span></span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeList;