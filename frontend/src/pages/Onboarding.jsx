import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [companyProfile, setCompanyProfile] = useState({
    companyName: '',
    industry: '',
    financialYearStart: 'April',
    financialYearEnd: 'March'
  });

  const [statutory, setStatutory] = useState({
    pf: { enabled: false, employeeContribution: 12, employerContribution: 12 },
    esi: { enabled: false, employeeContribution: 0.75, employerContribution: 3.25, wageLimit: 21000 },
    professionalTax: { enabled: false, state: '' }
  });

  const [accessLevels, setAccessLevels] = useState({
    payrollAdmin: { canProcessPayroll: true, canApprovePayroll: true },
    hrAdmin: { canManageEmployees: true, canManageSalaryStructure: true },
    finance: { canViewReports: true, canExportData: true }
  });

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/onboarding/company-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyProfile)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/onboarding/statutory-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(statutory)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep(3);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStep3Submit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('http://localhost:5000/api/onboarding/access-levels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(accessLevels)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // ✅ Update localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    user.onboardingCompleted = true;
    localStorage.setItem('user', JSON.stringify(user));

    // ✅ Force page reload to refresh AuthContext
    window.location.href = '/dashboard';
  } catch (err) {
    setError(err.message);
  }
};

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= num ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {num}
            </div>
            {num < 3 && (
              <div className={`flex-1 h-1 mx-2 ${step > num ? 'bg-blue-600' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Company Profile</span>
        <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Statutory Setup</span>
        <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Access Levels</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Organization Setup</h1>
          <p className="text-gray-600 text-center mb-8">Complete the setup to get started</p>

          {renderProgressBar()}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1Submit}>
              <h2 className="text-2xl font-bold mb-6">Step 1: Company Profile</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyProfile.companyName}
                  onChange={(e) => setCompanyProfile({...companyProfile, companyName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Industry</label>
                <select
                  value={companyProfile.industry}
                  onChange={(e) => setCompanyProfile({...companyProfile, industry: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail">Retail</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Financial Year Start</label>
                  <select
                    value={companyProfile.financialYearStart}
                    onChange={(e) => setCompanyProfile({...companyProfile, financialYearStart: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Financial Year End</label>
                  <select
                    value={companyProfile.financialYearEnd}
                    onChange={(e) => setCompanyProfile({...companyProfile, financialYearEnd: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Continue to Statutory Setup
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit}>
              <h2 className="text-2xl font-bold mb-6">Step 2: Statutory Configuration</h2>

              <div className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={statutory.pf.enabled}
                    onChange={(e) => setStatutory({
                      ...statutory,
                      pf: {...statutory.pf, enabled: e.target.checked}
                    })}
                    className="mr-3 w-5 h-5"
                  />
                  <label className="text-lg font-semibold">Enable Provident Fund (PF)</label>
                </div>
                {statutory.pf.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-8">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Employee Contribution (%)</label>
                      <input
                        type="number"
                        value={statutory.pf.employeeContribution}
                        onChange={(e) => setStatutory({
                          ...statutory,
                          pf: {...statutory.pf, employeeContribution: parseFloat(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Employer Contribution (%)</label>
                      <input
                        type="number"
                        value={statutory.pf.employerContribution}
                        onChange={(e) => setStatutory({
                          ...statutory,
                          pf: {...statutory.pf, employerContribution: parseFloat(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={statutory.esi.enabled}
                    onChange={(e) => setStatutory({
                      ...statutory,
                      esi: {...statutory.esi, enabled: e.target.checked}
                    })}
                    className="mr-3 w-5 h-5"
                  />
                  <label className="text-lg font-semibold">Enable ESI (Employee State Insurance)</label>
                </div>
                {statutory.esi.enabled && (
                  <div className="ml-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Employee (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={statutory.esi.employeeContribution}
                          onChange={(e) => setStatutory({
                            ...statutory,
                            esi: {...statutory.esi, employeeContribution: parseFloat(e.target.value)}
                          })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Employer (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={statutory.esi.employerContribution}
                          onChange={(e) => setStatutory({
                            ...statutory,
                            esi: {...statutory.esi, employerContribution: parseFloat(e.target.value)}
                          })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Wage Limit (₹)</label>
                      <input
                        type="number"
                        value={statutory.esi.wageLimit}
                        onChange={(e) => setStatutory({
                          ...statutory,
                          esi: {...statutory.esi, wageLimit: parseInt(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={statutory.professionalTax.enabled}
                    onChange={(e) => setStatutory({
                      ...statutory,
                      professionalTax: {...statutory.professionalTax, enabled: e.target.checked}
                    })}
                    className="mr-3 w-5 h-5"
                  />
                  <label className="text-lg font-semibold">Enable Professional Tax</label>
                </div>
                {statutory.professionalTax.enabled && (
                  <div className="ml-8">
                    <label className="block text-sm text-gray-700 mb-1">State</label>
                    <select
                      value={statutory.professionalTax.state}
                      onChange={(e) => setStatutory({
                        ...statutory,
                        professionalTax: {...statutory.professionalTax, state: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={statutory.professionalTax.enabled}
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Continue to Access Levels
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3Submit}>
              <h2 className="text-2xl font-bold mb-6">Step 3: Define Access Levels</h2>

              <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                <h3 className="font-bold text-lg mb-3 text-blue-700">Payroll Admin Permissions</h3>
                <div className="space-y-2 ml-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessLevels.payrollAdmin.canProcessPayroll}
                      onChange={(e) => setAccessLevels({
                        ...accessLevels,
                        payrollAdmin: {...accessLevels.payrollAdmin, canProcessPayroll: e.target.checked}
                      })}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Can Process Payroll</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessLevels.payrollAdmin.canApprovePayroll}
                      onChange={(e) => setAccessLevels({
                        ...accessLevels,
                        payrollAdmin: {...accessLevels.payrollAdmin, canApprovePayroll: e.target.checked}
                      })}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Can Approve Payroll</span>
                  </label>
                </div>
              </div>

              <div className="mb-6 p-4 border rounded-lg bg-green-50">
                <h3 className="font-bold text-lg mb-3 text-green-700">HR Admin Permissions</h3>
                <div className="space-y-2 ml-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessLevels.hrAdmin.canManageEmployees}
                      onChange={(e) => setAccessLevels({
                        ...accessLevels,
                        hrAdmin: {...accessLevels.hrAdmin, canManageEmployees: e.target.checked}
                      })}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Can Manage Employees</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessLevels.hrAdmin.canManageSalaryStructure}
                      onChange={(e) => setAccessLevels({
                        ...accessLevels,
                        hrAdmin: {...accessLevels.hrAdmin, canManageSalaryStructure: e.target.checked}
                      })}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Can Manage Salary Structure</span>
                  </label>
                </div>
              </div>

              <div className="mb-6 p-4 border rounded-lg bg-purple-50">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Finance Permissions</h3>
                <div className="space-y-2 ml-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessLevels.finance.canViewReports}
                      onChange={(e) => setAccessLevels({
                        ...accessLevels,
                        finance: {...accessLevels.finance, canViewReports: e.target.checked}
                      })}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Can View Reports</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessLevels.finance.canExportData}
                      onChange={(e) => setAccessLevels({
                        ...accessLevels,
                        finance: {...accessLevels.finance, canExportData: e.target.checked}
                      })}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Can Export Data</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
