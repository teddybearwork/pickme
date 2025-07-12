import React from 'react';
import { Search, CreditCard, Activity, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const OfficerOverview = () => {
  const stats = [
    { name: 'Available Credits', value: '45', icon: CreditCard, change: '-5 today', changeType: 'negative' },
    { name: 'Queries Today', value: '8', icon: Search, change: '+3', changeType: 'positive' },
    { name: 'Success Rate', value: '94%', icon: TrendingUp, change: '+2%', changeType: 'positive' },
    { name: 'Avg Response', value: '1.2s', icon: Clock, change: '-0.3s', changeType: 'positive' },
  ];

  const recentQueries = [
    { id: '1', type: 'OSINT', input: '9848012345', status: 'completed', time: '2 mins ago', credits: 0 },
    { id: '2', type: 'RC Check', input: 'TN09AB1234', status: 'completed', time: '15 mins ago', credits: 1 },
    { id: '3', type: 'Cell ID', input: 'Tower-4521', status: 'pending', time: '32 mins ago', credits: 0 },
    { id: '4', type: 'OSINT', input: '9198765432', status: 'completed', time: '1 hour ago', credits: 0 },
    { id: '5', type: 'PRO Query', input: 'email@example.com', status: 'failed', time: '2 hours ago', credits: 0 },
  ];

  const notifications = [
    { type: 'info', message: 'New API features available in your plan', time: '1 hour ago' },
    { type: 'warning', message: 'Credit balance is running low', time: '3 hours ago' },
    { type: 'success', message: 'Query limit reset for new day', time: '12 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome back! Here's your activity overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Queries */}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Recent Queries</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {recentQueries.map((query) => (
              <div key={query.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{query.type}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        query.status === 'completed' ? 'bg-green-100 text-green-800' :
                        query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {query.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{query.input}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{query.time}</p>
                    <p className="text-xs text-slate-600">{query.credits} credits</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all queries →
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Notifications</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {notifications.map((notification, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${
                    notification.type === 'success' ? 'text-green-500' :
                    notification.type === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <Search className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">New OSINT Query</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Check RC Details</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Buy Credits</p>
            </button>
          </div>
        </div>
      </div>

      {/* Device Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Device Security Enabled</h3>
            <p className="text-sm text-amber-700 mt-1">
              Single-device authentication is active. Logging in from a new device will automatically log you out from this session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerOverview;