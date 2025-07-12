import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import OfficerDashboard from './components/officer/OfficerDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 transition-colors duration-300">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/officer/*" element={
                <ProtectedRoute requiredRole="officer">
                  <OfficerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;