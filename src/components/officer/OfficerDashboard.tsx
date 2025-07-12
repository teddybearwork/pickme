import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OfficerLayout from './OfficerLayout';
import OfficerOverview from './OfficerOverview';
import QueryInterface from './QueryInterface';
import QueryHistory from './QueryHistory';
import CreditStatus from './CreditStatus';

const OfficerDashboard = () => {
  return (
    <OfficerLayout>
      <Routes>
        <Route path="/" element={<OfficerOverview />} />
        <Route path="/query" element={<QueryInterface />} />
        <Route path="/history" element={<QueryHistory />} />
        <Route path="/credits" element={<CreditStatus />} />
        <Route path="*" element={<Navigate to="/officer" replace />} />
      </Routes>
    </OfficerLayout>
  );
};

export default OfficerDashboard;