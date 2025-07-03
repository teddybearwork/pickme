import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import { StatusBadge } from '../components/UI/StatusBadge';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { Officer } from '../types';

export const Officers: React.FC = () => {
  const { officers, isLoading } = useData();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.mobile.includes(searchTerm) ||
                         officer.telegram_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || officer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
            Officer Management
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage law enforcement personnel and their access
          </p>
        </div>
        <button className="bg-cyber-gradient text-white px-4 py-2 rounded-lg hover:shadow-cyber transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Officer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`border border-cyber-teal/20 rounded-lg p-6 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Officers
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {officers.length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-cyber-teal" />
          </div>
        </div>

        <div className={`border border-cyber-teal/20 rounded-lg p-6 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Active Officers
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {officers.filter(o => o.status === 'Active').length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className={`border border-cyber-teal/20 rounded-lg p-6 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Suspended Officers
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {officers.filter(o => o.status === 'Suspended').length}
              </p>
            </div>
            <UserX className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className={`border border-cyber-teal/20 rounded-lg p-6 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Credits
              </p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {officers.reduce((sum, o) => sum + o.credits_remaining, 0)}
              </p>
            </div>
            <Download className="w-8 h-8 text-electric-blue" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`border border-cyber-teal/20 rounded-lg p-4 ${
        isDark ? 'bg-muted-graphite' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search officers by name, mobile, or telegram ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border border-cyber-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal focus:border-transparent ${
                  isDark 
                    ? 'bg-crisp-black text-white placeholder-gray-500' 
                    : 'bg-white text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 border border-cyber-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal ${
                isDark 
                  ? 'bg-crisp-black text-white' 
                  : 'bg-white text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <button className="px-3 py-2 bg-cyber-teal/20 text-cyber-teal rounded-lg hover:bg-cyber-teal/30 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="px-3 py-2 bg-electric-blue/20 text-electric-blue rounded-lg hover:bg-electric-blue/30 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOfficers.map((officer) => (
          <div key={officer.id} className={`border border-cyber-teal/20 rounded-lg p-6 hover:shadow-cyber transition-all duration-300 ${
            isDark ? 'bg-muted-graphite' : 'bg-white'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={officer.avatar}
                  alt={officer.name}
                  className="w-12 h-12 rounded-full border-2 border-cyber-teal/30"
                />
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {officer.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {officer.telegram_id}
                  </p>
                </div>
              </div>
              <StatusBadge status={officer.status} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Mobile:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{officer.mobile}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Registered:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{officer.registered_on}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Last Active:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{officer.last_active}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Credits:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  {officer.credits_remaining}/{officer.total_credits}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Queries:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{officer.total_queries}</span>
              </div>
            </div>

            {/* Credit Progress */}
            <div className="mt-4">
              <div className={`flex justify-between text-xs mb-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span>Credit Usage</span>
                <span>{Math.round((officer.credits_remaining / officer.total_credits) * 100)}%</span>
              </div>
              <div className={`w-full rounded-full h-2 ${
                isDark ? 'bg-crisp-black' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-cyber-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(officer.credits_remaining / officer.total_credits) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-4 pt-4 border-t border-cyber-teal/20">
              <div className="flex space-x-2">
                <button className={`p-2 transition-colors ${
                  isDark ? 'text-gray-400 hover:text-cyber-teal' : 'text-gray-600 hover:text-cyber-teal'
                }`}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className={`p-2 transition-colors ${
                  isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-400'
                }`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                {officer.status === 'Active' ? (
                  <button className={`p-2 transition-colors ${
                    isDark ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
                  }`}>
                    <UserX className="w-4 h-4" />
                  </button>
                ) : (
                  <button className={`p-2 transition-colors ${
                    isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-400'
                  }`}>
                    <UserCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredOfficers.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDark ? 'bg-muted-graphite' : 'bg-gray-100'
          }`}>
            <Search className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            No Officers Found
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
};