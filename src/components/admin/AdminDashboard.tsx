import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import APIManagement from './APIManagement';
import CreditControl from './CreditControl';
import LogsReports from './LogsReports';
import BroadcastSystem from './BroadcastSystem';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/apis" element={<APIManagement />} />
        <Route path="/credits" element={<CreditControl />} />
        <Route path="/logs" element={<LogsReports />} />
        <Route path="/broadcasts" element={<BroadcastSystem />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;