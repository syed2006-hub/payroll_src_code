import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { employeeLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await employeeLogin(email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-8 lg:px-24">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-3xl">💼</span>
              <span className="text-xl font-bold text-gray-900">
                PayrollPro
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Employee Login
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Login using credentials shared by your HR
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="employee@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium shadow disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            Don’t have login details? Contact your HR administrator.
          </p>
        </div>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174"
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/40 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-end pb-24 px-12">
          <div className="border-l-4 border-yellow-400 pl-6">
            <h3 className="text-4xl font-bold text-white">
              Employee Self-Service
            </h3>
            <p className="text-indigo-100 mt-2">
              Payslips, attendance, leave & profile — all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
