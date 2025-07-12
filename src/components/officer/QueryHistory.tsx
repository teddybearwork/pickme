import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar } from 'lucide-react';

const QueryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const queries = [
    {
      id: '1',
      timestamp: '2025-01-12 15:30:24',
      type: 'OSINT',
      input: '9848012345',
      status: 'completed',
      creditsUsed: 0,
      responseTime: '1.2s',
      result: 'Success - Data found'
    },
    {
      id: '2',
      timestamp: '2025-01-12 15:28:15',
      type: 'RC',
      input: 'TN09AB1234',
      status: 'completed',
      creditsUsed: 1,
      responseTime: '2.1s',
      result: 'Success - Vehicle details retrieved'
    },
    {
      id: '3',
      timestamp: '2025-01-12 15:25:33',
      type: 'CELLID',
      input: 'Tower-4521',
      status: 'pending',
      creditsUsed: 0,
      responseTime: '-',
      result: 'Processing...'
    },
    {
      id: '4',
      timestamp: '2025-01-12 15:22:45',
      type: 'PRO',
      input: 'email@example.com',
      status: 'failed',
      creditsUsed: 0,
      responseTime: '0.5s',
      result: 'Error - Insufficient data'
    },
    {
      id: '5',
      timestamp: '2025-01-12 15:20:12',
      type: 'OSINT',
      input: '9198765432',
      status: 'completed',
      creditsUsed: 0,
      responseTime: '1.8s',
      result: 'Success - Profile found'
    },
    {
      id: '6',
      timestamp: '2025-01-12 14:15:30',
      type: 'RC',
      input: 'KA05MN7890',
      status: 'completed',
      creditsUsed: 1,
      responseTime: '1.5s',
      result: 'Success - Registration verified'
    },
    {
      id: '7',
      timestamp: '2025-01-12 13:45:22',
      type: 'FASTAG',
      input: 'FT123456789',
      status: 'completed',
      creditsUsed: 1,
      responseTime: '2.3s',
      result: 'Success - Fastag details found'
    },
    {
      id: '8',
      timestamp: '2025-01-12 12:30:45',
      type: 'OSINT',
      input: '9876543210',
      status: 'failed',
      creditsUsed: 0,
      responseTime: '0.8s',
      result: 'No data available'
    }
  ];

  const stats = {
    total: queries.length,
    completed: queries.filter(q => q.status === 'completed').length,
    pending: queries.filter(q => q.status === 'pending').length,
    failed: queries.filter(q => q.status === 'failed').length,
    creditsUsed: queries.reduce((sum, q) => sum + q.creditsUsed, 0)
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || query.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || query.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Query History</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage your query history</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Total Queries</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-slate-600">Completed</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-slate-600">Pending</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-sm text-slate-600">Failed</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.creditsUsed}</p>
            <p className="text-sm text-slate-600">Credits Used</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="OSINT">OSINT</option>
              <option value="RC">RC Check</option>
              <option value="CELLID">Cell ID</option>
              <option value="PRO">PRO Query</option>
              <option value="FASTAG">Fastag</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Query Table */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Input
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredQueries.map((query) => (
                <tr key={query.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {query.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {query.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {query.input}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      query.status === 'completed' ? 'bg-green-100 text-green-800' :
                      query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {query.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {query.creditsUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {query.responseTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-1" title="View Details">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing {filteredQueries.length} of {queries.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryHistory;