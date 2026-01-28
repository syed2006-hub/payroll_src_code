import { useState, useEffect } from "react";
import api from "../../../utils/api"; // Adjust path as needed
import { 
  Save, 
  Building2, 
  ShieldCheck, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Edit2, 
  X 
} from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Toggle for Edit Mode
  const [isEditing, setIsEditing] = useState(false);

  // 1. Company Profile State
  const [companyProfile, setCompanyProfile] = useState({
    companyName: "",
    industry: "",
    financialYearStart: "",
    financialYearEnd: "",
  });

  // 2. Statutory Config State
  const [statutory, setStatutory] = useState({
    pf: { enabled: false, employeeContribution: 0, employerContribution: 0 },
    esi: { enabled: false, employeeContribution: 0, employerContribution: 0, wageLimit: 0 },
    professionalTax: { enabled: false, state: "" },
  });

  // 3. Access Levels State
  const [accessLevels, setAccessLevels] = useState({
    payrollAdmin: { canProcessPayroll: false, canApprovePayroll: false },
    hrAdmin: { canManageEmployees: false, canManageSalaryStructure: false },
    finance: { canViewReports: false, canExportData: false },
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/settings/status");
        const org = res?.data?.organization;

        if (org) {
          setCompanyProfile({
            companyName: org.companyName || "",
            industry: org.industry || "",
            financialYearStart: org.financialYear?.startMonth || "",
            financialYearEnd: org.financialYear?.endMonth || "",
          });

          setStatutory({
            pf: { 
              enabled: org.statutoryConfig?.pf?.enabled ?? false, 
              employeeContribution: org.statutoryConfig?.pf?.employeeContribution ?? 0,
              employerContribution: org.statutoryConfig?.pf?.employerContribution ?? 0
            },
            esi: {
              enabled: org.statutoryConfig?.esi?.enabled ?? false,
              employeeContribution: org.statutoryConfig?.esi?.employeeContribution ?? 0,
              employerContribution: org.statutoryConfig?.esi?.employerContribution ?? 0,
              wageLimit: org.statutoryConfig?.esi?.wageLimit ?? 0
            },
            professionalTax: {
              enabled: org.statutoryConfig?.professionalTax?.enabled ?? false,
              state: org.statutoryConfig?.professionalTax?.state ?? ""
            }
          });

          setAccessLevels({
            payrollAdmin: {
              canProcessPayroll: org.accessLevels?.payrollAdmin?.canProcessPayroll ?? false,
              canApprovePayroll: org.accessLevels?.payrollAdmin?.canApprovePayroll ?? false
            },
            hrAdmin: {
              canManageEmployees: org.accessLevels?.hrAdmin?.canManageEmployees ?? false,
              canManageSalaryStructure: org.accessLevels?.hrAdmin?.canManageSalaryStructure ?? false
            },
            finance: {
              canViewReports: org.accessLevels?.finance?.canViewReports ?? false,
              canExportData: org.accessLevels?.finance?.canExportData ?? false
            }
          });
        }
      } catch (err) {
        console.error("Load failed:", err);
        setMessage({ type: "error", text: "Failed to load settings." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- SAVE HANDLERS ---
  const saveCompanyProfile = async () => {
    try {
      setMessage({ type: "", text: "" });
      const payload = {
        companyName: companyProfile.companyName,
        industry: companyProfile.industry,
        financialYear: {
          startMonth: companyProfile.financialYearStart,
          endMonth: companyProfile.financialYearEnd
        }
      };
      await api.post("/settings/company-profile", payload);
      setMessage({ type: "success", text: "Company profile updated successfully!" });
      setIsEditing(false); // Optional: Exit edit mode after save
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update company profile." });
    }
  };

  const saveStatutory = async () => {
    try {
      setMessage({ type: "", text: "" });
      await api.post("/settings/statutory-setup", statutory);
      setMessage({ type: "success", text: "Statutory configuration updated!" });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update statutory settings." });
    }
  };

  const saveAccessLevels = async () => {
    try {
      setMessage({ type: "", text: "" });
      await api.post("/settings/access-levels", accessLevels);
      setMessage({ type: "success", text: "Access levels updated!" });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update access levels." });
    }
  };

  // Helper to manage Edit Toggle
  const toggleEditMode = () => {
    if (isEditing) {
      // Logic if user cancels (you might want to re-fetch data here to revert changes)
      setMessage({ type: "", text: "" });
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
           <p className="text-gray-500">Manage your organization configurations</p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
            {/* EDIT TOGGLE BUTTON */}
            <button
                onClick={toggleEditMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                    isEditing 
                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                {isEditing ? (
                    <><X size={18} /> Cancel Editing</>
                ) : (
                    <><Edit2 size={18} /> Edit Settings</>
                )}
            </button>

            {message.text && (
            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
                {message.text}
            </div>
            )}
        </div>
      </div>

      {/* 1. COMPANY PROFILE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Building2 className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Company Profile</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input 
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              value={companyProfile.companyName}
              onChange={(e) => setCompanyProfile({...companyProfile, companyName: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Industry</label>
            <input 
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              value={companyProfile.industry}
              onChange={(e) => setCompanyProfile({...companyProfile, industry: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Financial Year Start</label>
            <select 
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              value={companyProfile.financialYearStart}
              onChange={(e) => setCompanyProfile({...companyProfile, financialYearStart: e.target.value})}
            >
              <option value="">Select Month</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Financial Year End</label>
            <select 
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              value={companyProfile.financialYearEnd}
              onChange={(e) => setCompanyProfile({...companyProfile, financialYearEnd: e.target.value})}
            >
              <option value="">Select Month</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        {/* Only show Save button if editing */}
        {isEditing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button onClick={saveCompanyProfile} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
                    <Save size={18} /> Save Profile
                </button>
            </div>
        )}
      </div>

      {/* 2. STATUTORY CONFIG */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <ShieldCheck className="text-green-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Statutory Configuration</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* PF Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-700">Provident Fund (PF)</h3>
               <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                 <input 
                   type="checkbox" 
                   disabled={!isEditing}
                   checked={statutory.pf.enabled} 
                   onChange={(e) => setStatutory(p => ({...p, pf: {...p.pf, enabled: e.target.checked}}))}
                   className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:text-gray-400"
                 />
                 <span className="text-sm font-medium text-gray-600">Enable PF</span>
               </label>
            </div>
            {statutory.pf.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-gray-500">Employee Contribution (%)</label>
                   <input 
                     type="number" 
                     disabled={!isEditing}
                     className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" 
                     value={statutory.pf.employeeContribution} 
                     onChange={(e) => setStatutory(p => ({...p, pf: {...p.pf, employeeContribution: Number(e.target.value)}}))}
                   />
                </div>
                <div>
                   <label className="text-xs text-gray-500">Employer Contribution (%)</label>
                   <input 
                     type="number" 
                     disabled={!isEditing}
                     className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" 
                     value={statutory.pf.employerContribution} 
                     onChange={(e) => setStatutory(p => ({...p, pf: {...p.pf, employerContribution: Number(e.target.value)}}))}
                   />
                </div>
              </div>
            )}
          </div>

          {/* ESI Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-700">Employee State Insurance (ESI)</h3>
               <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                 <input 
                   type="checkbox" 
                   disabled={!isEditing}
                   checked={statutory.esi.enabled} 
                   onChange={(e) => setStatutory(p => ({...p, esi: {...p.esi, enabled: e.target.checked}}))}
                   className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:text-gray-400"
                 />
                 <span className="text-sm font-medium text-gray-600">Enable ESI</span>
               </label>
            </div>
            {statutory.esi.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                   <label className="text-xs text-gray-500">Employee Contrib (%)</label>
                   <input 
                     type="number" 
                     disabled={!isEditing}
                     className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" 
                     value={statutory.esi.employeeContribution} 
                     onChange={(e) => setStatutory(p => ({...p, esi: {...p.esi, employeeContribution: Number(e.target.value)}}))}
                   />
                </div>
                <div>
                   <label className="text-xs text-gray-500">Employer Contrib (%)</label>
                   <input 
                     type="number" 
                     disabled={!isEditing}
                     className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" 
                     value={statutory.esi.employerContribution} 
                     onChange={(e) => setStatutory(p => ({...p, esi: {...p.esi, employerContribution: Number(e.target.value)}}))}
                   />
                </div>
                <div>
                   <label className="text-xs text-gray-500">Wage Limit (Amount)</label>
                   <input 
                     type="number" 
                     disabled={!isEditing}
                     className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-500" 
                     value={statutory.esi.wageLimit} 
                     onChange={(e) => setStatutory(p => ({...p, esi: {...p.esi, wageLimit: Number(e.target.value)}}))}
                   />
                </div>
              </div>
            )}
          </div>

          {/* Professional Tax Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-700">Professional Tax (PT)</h3>
               <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                 <input 
                   type="checkbox" 
                   disabled={!isEditing}
                   checked={statutory.professionalTax.enabled} 
                   onChange={(e) => setStatutory(p => ({...p, professionalTax: {...p.professionalTax, enabled: e.target.checked}}))}
                   className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:text-gray-400"
                 />
                 <span className="text-sm font-medium text-gray-600">Enable PT</span>
               </label>
            </div>
             {statutory.professionalTax.enabled && (
              <div>
                 <label className="text-xs text-gray-500">State</label>
                 <select 
                   disabled={!isEditing}
                   className="w-full border p-2 rounded bg-white disabled:bg-gray-100 disabled:text-gray-500" 
                   value={statutory.professionalTax.state}
                   onChange={(e) => setStatutory(p => ({...p, professionalTax: {...p.professionalTax, state: e.target.value}}))}
                 >
                   <option value="">Select State</option>
                   <option value="Tamil Nadu">Tamil Nadu</option>
                   <option value="Karnataka">Karnataka</option>
                   <option value="Maharashtra">Maharashtra</option>
                 </select>
              </div>
            )}
          </div>
        </div>
        
        {isEditing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button onClick={saveStatutory} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
                    <Save size={18} /> Save Statutory
                </button>
            </div>
        )}
      </div>

      {/* 3. ACCESS LEVELS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Users className="text-purple-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Access Control</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payroll Admin Card */}
          <div className="border rounded-lg p-4 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Payroll Admin</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                <input 
                  type="checkbox" 
                  disabled={!isEditing}
                  checked={accessLevels.payrollAdmin.canProcessPayroll} 
                  onChange={(e) => setAccessLevels(p => ({...p, payrollAdmin: {...p.payrollAdmin, canProcessPayroll: e.target.checked}}))}
                  className="rounded text-purple-600 focus:ring-purple-500 disabled:text-gray-400"
                />
                <span className="text-sm text-gray-700">Process Payroll</span>
              </label>
              <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                <input 
                  type="checkbox" 
                  disabled={!isEditing}
                  checked={accessLevels.payrollAdmin.canApprovePayroll} 
                  onChange={(e) => setAccessLevels(p => ({...p, payrollAdmin: {...p.payrollAdmin, canApprovePayroll: e.target.checked}}))}
                  className="rounded text-purple-600 focus:ring-purple-500 disabled:text-gray-400"
                />
                <span className="text-sm text-gray-700">Approve Payroll</span>
              </label>
            </div>
          </div>

          {/* HR Admin Card */}
          <div className="border rounded-lg p-4 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">HR Admin</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                <input 
                  type="checkbox" 
                  disabled={!isEditing}
                  checked={accessLevels.hrAdmin.canManageEmployees} 
                  onChange={(e) => setAccessLevels(p => ({...p, hrAdmin: {...p.hrAdmin, canManageEmployees: e.target.checked}}))}
                  className="rounded text-purple-600 focus:ring-purple-500 disabled:text-gray-400"
                />
                <span className="text-sm text-gray-700">Manage Employees</span>
              </label>
              <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                <input 
                  type="checkbox" 
                  disabled={!isEditing}
                  checked={accessLevels.hrAdmin.canManageSalaryStructure} 
                  onChange={(e) => setAccessLevels(p => ({...p, hrAdmin: {...p.hrAdmin, canManageSalaryStructure: e.target.checked}}))}
                  className="rounded text-purple-600 focus:ring-purple-500 disabled:text-gray-400"
                />
                <span className="text-sm text-gray-700">Manage Salaries</span>
              </label>
            </div>
          </div>

           {/* Finance Card */}
           <div className="border rounded-lg p-4 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Finance Team</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                <input 
                  type="checkbox" 
                  disabled={!isEditing}
                  checked={accessLevels.finance.canViewReports} 
                  onChange={(e) => setAccessLevels(p => ({...p, finance: {...p.finance, canViewReports: e.target.checked}}))}
                  className="rounded text-purple-600 focus:ring-purple-500 disabled:text-gray-400"
                />
                <span className="text-sm text-gray-700">View Reports</span>
              </label>
              <label className={`flex items-center gap-2 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}>
                <input 
                  type="checkbox" 
                  disabled={!isEditing}
                  checked={accessLevels.finance.canExportData} 
                  onChange={(e) => setAccessLevels(p => ({...p, finance: {...p.finance, canExportData: e.target.checked}}))}
                  className="rounded text-purple-600 focus:ring-purple-500 disabled:text-gray-400"
                />
                <span className="text-sm text-gray-700">Export Data</span>
              </label>
            </div>
          </div>
        </div>

        {isEditing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button onClick={saveAccessLevels} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
                    <Save size={18} /> Save Access
                </button>
            </div>
        )}
      </div>
    </div>
  );
}