import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout/Layout';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { Officers } from './pages/Officers';
import { QueryHistory } from './pages/QueryHistory';
import { Credits } from './pages/Credits';
import { APIManagement } from './pages/APIManagement';
import { LiveRequests } from './pages/LiveRequests';
import { Settings } from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/officers" element={
          <ProtectedRoute>
            <Layout>
              <Officers />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/queries" element={
          <ProtectedRoute>
            <Layout>
              <QueryHistory />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/credits" element={
          <ProtectedRoute>
            <Layout>
              <Credits />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/apis" element={
          <ProtectedRoute>
            <Layout>
              <APIManagement />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/live" element={
          <ProtectedRoute>
            <Layout>
              <LiveRequests />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid #00B7B8',
          },
        }}
      />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen font-cyber" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;