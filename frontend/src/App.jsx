import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import DashboardRendering from './pages/DashboardRendering';
import Unauthorized from './pages/Unauthorized';
import UserManagement from './pages/UserManagement';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={['Super Admin']}>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRendering />
              </ProtectedRoute>
            }
          />
          <Route
    path="/users"
    element={
      <ProtectedRoute allowedRoles={['Super Admin']}>
        <UserManagement />
      </ProtectedRoute>
    }
  />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;