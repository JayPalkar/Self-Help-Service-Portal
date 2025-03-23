import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '@cloudscape-design/global-styles/index.css';

import AdminDashboard from './components/dashboard/AdminDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/SignUp';

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactElement; requiredRole: string }) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />

            {/* Protected admin routes - using a single route for all dashboard content */}
            <Route
              path="/admin/*"
              element={
                // <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                // </ProtectedRoute>
              }
            />

            {/* Protected employee routes */}
            <Route
              path="/employee/*"
              element={
                // <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboard />
                // </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
    </Router>
  );
}

export default App;