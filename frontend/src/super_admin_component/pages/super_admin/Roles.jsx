import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Briefcase, Building2, Plus, Loader2, X, AlertCircle, Shield, Save, CheckCircle2 } from "lucide-react";

// Permission Constants for cleaner code
const PERMISSIONS = {
  ALL_EXCEPT_ORG: "All access except Organization Settings",
  PAYROLL_ONLY: "Access to Payroll Management",
  USER_MGMT: "Access to User Management",
  VIEW_EXPORT: "View and Export Data Only"
};

export default function Roles() {
  const { token } = useContext(AuthContext);
  
  // Data State
  const [data, setData] = useState({ roles: [], departments: [], roleBasedAccess: {} });
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [error, setError] = useState(""); 
  const [successMsg, setSuccessMsg] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDept, setNewDept] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);

  // --- 1. Fetch Data ---
  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/organization/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        // Ensure roleBasedAccess exists even if empty
        setData({ 
          ...result, 
          roleBasedAccess: result.roleBasedAccess || {} 
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSettings();
  }, [token]);

  // --- 2. Handlers for Roles & Depts (Existing Logic) ---
  const handleAddRole = async (e) => {
    e.preventDefault();
    setError(""); 
    if (!newRole.trim()) return;
    if (newRole.trim().toLowerCase() === "super admin") {
      setError("You cannot add a role named 'Super Admin'.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/organization/add-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) { setNewRole(""); fetchSettings(); }
    } catch (error) { console.error(error); } finally { setSubmitting(false); }
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    setError("");
    if (!newDept.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/organization/add-department", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ department: newDept })
      });
      if (res.ok) { setNewDept(""); fetchSettings(); }
    } catch (error) { console.error(error); } finally { setSubmitting(false); }
  };

  const handleDeleteRole = async (roleToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${roleToDelete}?`)) return;
    try {
      const res = await fetch("http://localhost:5000/api/organization/delete-role", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: roleToDelete })
      });
      if (res.ok) fetchSettings();
    } catch (error) { console.error("Error deleting role:", error); }
  };

  const handleDeleteDept = async (deptToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${deptToDelete}?`)) return;
    try {
      const res = await fetch("http://localhost:5000/api/organization/delete-department", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ department: deptToDelete })
      });
      if (res.ok) fetchSettings();
    } catch (error) { console.error("Error deleting department:", error); }
  };

  // --- 3. Handlers for Permissions (New Logic) ---
  
  // Updates the local state when a dropdown changes
  const handlePermissionChange = (roleName, permissionValue) => {
    setData(prev => ({
      ...prev,
      roleBasedAccess: {
        ...prev.roleBasedAccess,
        [roleName]: permissionValue
      }
    }));
  };

  // Saves the entire permission object to backend
  const savePermissions = async () => {
    setSavingPermissions(true);
    setSuccessMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/organization/update-permissions", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ roleBasedAccess: data.roleBasedAccess })
      });

      if (res.ok) {
        setSuccessMsg("Permissions updated successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError("Failed to save permissions.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while saving.");
    } finally {
      setSavingPermissions(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading settings...</div>;

  return (
    <div className="flex flex-col gap-6 p-1">
      
      {/* Messages */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-200">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-green-200">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* --- TOP SECTION: 2 COLUMNS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Roles */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Roles</h2>
              <p className="text-xs text-gray-500">Define employee hierarchy</p>
            </div>
          </div>

          <div className="flex-1 mb-6 space-y-2">
            {data.roles.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No roles defined.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.roles.map((role, index) => (
                  <div key={index} className="pl-3 pr-1 py-1 bg-gray-50 text-gray-700 text-sm rounded-md border border-gray-200 flex items-center gap-2 group">
                    <span>{role}</span>
                    <button onClick={() => handleDeleteRole(role)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5 transition"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleAddRole} className="flex gap-2 mt-auto">
            <input 
              type="text" placeholder="e.g. Senior Developer" value={newRole}
              onChange={(e) => { setNewRole(e.target.value); setError(""); }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button disabled={submitting || !newRole} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
              {submitting ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20} />}
            </button>
          </form>
        </div>

        {/* Right: Departments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Building2 size={20} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Departments</h2>
              <p className="text-xs text-gray-500">Organize your workforce</p>
            </div>
          </div>

          <div className="flex-1 mb-6 space-y-2">
            {data.departments.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No departments defined.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.departments.map((dept, index) => (
                  <div key={index} className="pl-3 pr-1 py-1 bg-gray-50 text-gray-700 text-sm rounded-md border border-gray-200 flex items-center gap-2 group">
                    <span>{dept}</span>
                    <button onClick={() => handleDeleteDept(dept)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5 transition"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleAddDept} className="flex gap-2 mt-auto">
            <input 
              type="text" placeholder="e.g. Marketing" value={newDept}
              onChange={(e) => { setNewDept(e.target.value); setError(""); }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button disabled={submitting || !newDept} className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition">
              {submitting ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20} />}
            </button>
          </form>
        </div>
      </div>

      {/* --- BOTTOM SECTION: ROLE BASED ACCESS (Full Width) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Shield size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Role Based Access Control</h2>
              <p className="text-xs text-gray-500">Assign permissions to each role</p>
            </div>
          </div>
          <button 
            onClick={savePermissions}
            disabled={savingPermissions}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {savingPermissions ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Permissions
          </button>
        </div>

        {/* Permissions Table */}
        <div className="p-6">
          {data.roles.length === 0 ? (
            <div className="text-center py-8 text-gray-400 italic">
              Create a role above to configure its permissions.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3 w-1/3">Role Name</th>
                    <th className="px-4 py-3">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.roles.map((role) => (
                    <tr key={role} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-4 font-medium text-gray-900">{role}</td>
                      <td className="px-4 py-4">
                        <select
                          value={data.roleBasedAccess[role] || ""}
                          onChange={(e) => handlePermissionChange(role, e.target.value)}
                          className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        >
                          <option value="" disabled>Select permission level...</option>
                          <option value="ALL_EXCEPT_ORG">{PERMISSIONS.ALL_EXCEPT_ORG}</option>
                          <option value="PAYROLL_ONLY">{PERMISSIONS.PAYROLL_ONLY}</option>
                          <option value="USER_MGMT">{PERMISSIONS.USER_MGMT}</option>
                          <option value="VIEW_EXPORT">{PERMISSIONS.VIEW_EXPORT}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}