import React, { useState } from 'react';
import { CreditCard, Plus, Minus, RefreshCw, DollarSign, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { StatCard } from '../components/UI/StatCard';

export const Credits: React.FC = () => {
  const { transactions, officers, isLoading } = useData();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.officer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || transaction.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const totalCreditsIssued = transactions
    .filter(t => t.action === 'Renewal' || t.action === 'Top-up')
    .reduce((sum, t) => sum + t.credits, 0);

  const totalCreditsUsed = transactions
    .filter(t => t.action === 'Deduction')
    .reduce((sum, t) => sum + Math.abs(t.credits), 0);

  const totalRevenue = totalCreditsUsed * 2; // Assuming ₹2 per credit

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Renewal':
        return <RefreshCw className="w-4 h-4 text-green-400" />;
      case 'Deduction':
        return <Minus className="w-4 h-4 text-red-400" />;
      case 'Top-up':
        return <Plus className="w-4 h-4 text-blue-400" />;
      case 'Refund':
        return <RefreshCw className="w-4 h-4 text-yellow-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Renewal':
      case 'Top-up':
        return 'text-green-400';
      case 'Deduction':
        return 'text-red-400';
      case 'Refund':
        return 'text-yellow-400';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 min-h-screen ${isDark ? 'bg-crisp-black' : 'bg-soft-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Credits & Billing
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage credit transactions and billing operations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-electric-blue/20 text-electric-blue px-4 py-2 rounded-lg hover:bg-electric-blue/30 transition-all duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="bg-cyber-gradient text-white px-4 py-2 rounded-lg hover:shadow-cyber transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Credits</span>
          </button>
        </div>
      </div>

      {/* Stats Grid - Fixed Theme Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`border border-cyber-teal/20 rounded-lg p-6 hover:shadow-cyber transition-all duration-300 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Credits Issued
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totalCreditsIssued.toLocaleString()}
              </p>
              <p className="text-xs mt-1 text-green-400">
                +15% this month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border-green-500/30 text-green-400">
              <Plus className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`border border-cyber-teal/20 rounded-lg p-6 hover:shadow-cyber transition-all duration-300 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Credits Used
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totalCreditsUsed.toLocaleString()}
              </p>
              <p className="text-xs mt-1 text-red-400">
                85% utilization
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border-red-500/30 text-red-400">
              <Minus className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`border border-cyber-teal/20 rounded-lg p-6 hover:shadow-cyber transition-all duration-300 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Revenue Generated
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₹{totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs mt-1 text-green-400">
                +22% from last month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-cyber-teal/10 border-cyber-teal/30 text-cyber-teal">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className={`border border-cyber-teal/20 rounded-lg p-6 hover:shadow-cyber transition-all duration-300 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Active Officers
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {officers.filter(o => o.status === 'Active').length}
              </p>
              <p className="text-xs mt-1 text-green-400">
                91% retention rate
              </p>
            </div>
            <div className="p-3 rounded-lg bg-electric-blue/10 border-electric-blue/30 text-electric-blue">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Distribution Chart */}
      <div className={`border border-cyber-teal/20 rounded-lg p-6 ${
        isDark ? 'bg-muted-graphite' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Credit Distribution by Officer
          </h3>
          <Calendar className="w-5 h-5 text-cyber-teal" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {officers.slice(0, 6).map((officer) => (
            <div key={officer.id} className={`p-4 rounded-lg border ${
              isDark ? 'bg-crisp-black/50 border-cyber-teal/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {officer.name}
                </h4>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {officer.credits_remaining}/{officer.total_credits}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 ${
                isDark ? 'bg-crisp-black' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-cyber-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(officer.credits_remaining / officer.total_credits) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Used: {officer.total_credits - officer.credits_remaining}
                </span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {Math.round((officer.credits_remaining / officer.total_credits) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={`border border-cyber-teal/20 rounded-lg p-4 ${
        isDark ? 'bg-muted-graphite' : 'bg-white'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 border border-cyber-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal focus:border-transparent ${
                isDark 
                  ? 'bg-crisp-black text-white placeholder-gray-500' 
                  : 'bg-white text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={`px-3 py-2 border border-cyber-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal ${
              isDark 
                ? 'bg-crisp-black text-white' 
                : 'bg-white text-gray-900'
            }`}
          >
            <option value="all">All Actions</option>
            <option value="Renewal">Renewal</option>
            <option value="Deduction">Deduction</option>
            <option value="Top-up">Top-up</option>
            <option value="Refund">Refund</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-3 py-2 border border-cyber-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal ${
              isDark 
                ? 'bg-crisp-black text-white' 
                : 'bg-white text-gray-900'
            }`}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`border border-cyber-teal/20 rounded-lg overflow-hidden ${
        isDark ? 'bg-muted-graphite' : 'bg-white'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b border-cyber-teal/20 ${
              isDark ? 'bg-crisp-black/50' : 'bg-gray-50'
            }`}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Officer
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Action
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Credits
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Payment Mode
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Remarks
                </th>
                <th className={`px-6 py-4 text-left text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className={`border-b border-cyber-teal/10 transition-colors ${
                    isDark ? 'hover:bg-crisp-black/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {transaction.officer_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(transaction.action)}
                      <span className={`text-sm font-medium ${getActionColor(transaction.action)}`}>
                        {transaction.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${
                      transaction.credits > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.credits > 0 ? '+' : ''}{transaction.credits}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {transaction.payment_mode}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {transaction.remarks}
                  </td>
                  <td className={`px-6 py-4 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {transaction.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};