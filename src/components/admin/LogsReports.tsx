import React, { useState } from 'react';
import { FileText, Download, Filter, Search, Calendar, User, Activity } from 'lucide-react';

const LogsReports = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedCommand, setSelectedCommand] = useState('all');

  const logs = [
    {
      id: '1',
      timestamp: '2025-01-12 15:30:24',
      user: 'officer-mumbai-01',
      command: 'OSINT',
      input: '9848012345',
      status: 'success',
      creditsUsed: 0,
      responseTime: '1.2s',
      ipAddress: '192.168.1.45'
    },
    {
      id: '2',
      timestamp: '2025-01-12 15:28:15',
      user: 'officer-delhi-05',
      command: 'RC',
      input: 'TN09AB1234',
      status: 'success',
      creditsUsed: 1,
      responseTime: '2.1s',
      ipAddress: '192.168.1.78'
    },
    {
      id: '3',
      timestamp: '2025-01-12 15:25:33',
      user: 'officer-chennai-03',
      command: 'CELLID',
      input: 'Tower-4521',
      status: 'pending',
      creditsUsed: 0,
      responseTime: '-',
      ipAddress: '192.168.1.92'
    },
    {
      id: '4',
      timestamp: '2025-01-12 15:22:45',
      user: 'officer-pune-02',
      command: 'PRO',
      input: 'email@example.com',
      status: 'failed',
      creditsUsed: 0,
      responseTime: '0.5s',
      ipAddress: '192.168.1.156'
    },
    {
      id: '5',
      timestamp: '2025-01-12 15:20:12',
      user: 'officer-bangalore-01',
      command: 'OSINT',
      input: '9198765432',
      status: 'success',
      creditsUsed: 0,
      responseTime: '1.8s',
      ipAddress: '192.168.1.203'
    }
  ];

  const stats = {
    totalQueries: 1247,
    successfulQueries: 1089,
    failedQueries: 158,
    totalCreditsUsed: 2847
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Logs & Reports</h1>
          <p className="mt-1 text-sm text-slate-600">Monitor system activity and generate reports</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Queries</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalQueries.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Successful</p>
              <p className="text-2xl font-bold text-green-600">{stats.successfulQueries.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failedQueries}</p>
            </div>
            <Activity className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Credits Used</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalCreditsUsed.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
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
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="officer-mumbai-01">Officer Mumbai 01</option>
              <option value="officer-delhi-05">Officer Delhi 05</option>
              <option value="officer-chennai-03">Officer Chennai 03</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={selectedCommand}
              onChange={(e) => setSelectedCommand(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Commands</option>
              <option value="OSINT">OSINT</option>
              <option value="RC">RC Check</option>
              <option value="CELLID">Cell ID</option>
              <option value="PRO">PRO Query</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Activity Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Command
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{log.user}</div>
                      <div className="text-sm text-slate-500">{log.ipAddress}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {log.command}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {log.input}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' :
                      log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {log.creditsUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {log.responseTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing 1-5 of 1,247 entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">
                2
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

export default LogsReports;