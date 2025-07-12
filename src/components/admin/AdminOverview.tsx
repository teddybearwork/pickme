import React from 'react';
import { Users, Shield, CreditCard, Activity, TrendingUp, AlertTriangle, Zap, Eye } from 'lucide-react';

const AdminOverview = () => {
  const stats = [
    { name: 'Total Users', value: '47', icon: Users, change: '+12%', changeType: 'positive', color: 'primary' },
    { name: 'Active APIs', value: '8', icon: Shield, change: '+1', changeType: 'positive', color: 'success' },
    { name: 'Credits Used', value: '2,847', icon: CreditCard, change: '+573', changeType: 'positive', color: 'accent' },
    { name: 'Queries Today', value: '156', icon: Activity, change: '+23%', changeType: 'positive', color: 'warning' },
  ];

  const recentActivity = [
    { user: 'Officer Mumbai-01', action: 'OSINT Query', target: '98480xxxxx', time: '2 mins ago', status: 'success' },
    { user: 'Officer Delhi-05', action: 'RC Check', target: 'TN09AB1234', time: '5 mins ago', status: 'success' },
    { user: 'Officer Chennai-03', action: 'Cell ID', target: 'Tower-4521', time: '8 mins ago', status: 'pending' },
    { user: 'Officer Pune-02', action: 'PRO Query', target: 'email@example.com', time: '12 mins ago', status: 'failed' },
    { user: 'Officer Bangalore-01', action: 'OSINT Query', target: '91987xxxxx', time: '15 mins ago', status: 'success' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'API rate limit approaching for Signzy service', time: '10 mins ago' },
    { type: 'info', message: 'Scheduled maintenance tonight at 2:00 AM IST', time: '1 hour ago' },
    { type: 'error', message: 'Failed login attempt from Officer-Mumbai-03', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-secondary-900 dark:text-secondary-100 gradient-text">Dashboard Overview</h1>
        <p className="mt-2 text-secondary-600 dark:text-secondary-400 font-medium">Real-time system monitoring and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            primary: 'from-primary-500 to-primary-600 text-primary-600',
            success: 'from-success-500 to-success-600 text-success-600',
            accent: 'from-accent-500 to-accent-600 text-accent-600',
            warning: 'from-warning-500 to-warning-600 text-warning-600',
          };
          return (
            <div key={stat.name} className="card card-hover overflow-hidden animate-slide-up">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[1]} shadow-glow`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-6 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">{stat.value}</div>
                        <div className={`ml-3 flex items-baseline text-sm font-bold ${
                          stat.changeType === 'positive' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                        }`}>
                          <TrendingUp className="h-4 w-4 mr-1" />
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
        {/* Recent Activity */}
        <div className="card animate-slide-up">
          <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">Recent Activity</h2>
            </div>
          </div>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                      {activity.user}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                      {activity.action} • {activity.target}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status-badge ${
                      activity.status === 'success' ? 'status-success' :
                      activity.status === 'pending' ? 'status-warning' :
                      'status-danger'
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-secondary-400 font-medium">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <h2 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">System Alerts</h2>
            </div>
          </div>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="px-6 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-1 p-2 rounded-lg ${
                    alert.type === 'error' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-500' :
                    alert.type === 'warning' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-500' :
                    'bg-primary-100 dark:bg-primary-900/30 text-primary-500'
                  }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{alert.message}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 font-medium">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <Zap className="h-5 w-5 text-accent-600 dark:text-accent-400" />
            </div>
            <h2 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">Quick Actions</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 hover:from-primary-100 hover:to-primary-200 dark:hover:from-primary-800/30 dark:hover:to-primary-700/30 rounded-xl border border-primary-200 dark:border-primary-700 transition-all duration-300 hover:shadow-glow group">
              <Users className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <p className="text-sm font-bold text-primary-900 dark:text-primary-100">Add New User</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 hover:from-success-100 hover:to-success-200 dark:hover:from-success-800/30 dark:hover:to-success-700/30 rounded-xl border border-success-200 dark:border-success-700 transition-all duration-300 hover:shadow-glow group">
              <Shield className="h-8 w-8 text-success-600 dark:text-success-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <p className="text-sm font-bold text-success-900 dark:text-success-100">Configure API</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 hover:from-accent-100 hover:to-accent-200 dark:hover:from-accent-800/30 dark:hover:to-accent-700/30 rounded-xl border border-accent-200 dark:border-accent-700 transition-all duration-300 hover:shadow-glow group">
              <Eye className="h-8 w-8 text-accent-600 dark:text-accent-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <p className="text-sm font-bold text-accent-900 dark:text-accent-100">View Reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;