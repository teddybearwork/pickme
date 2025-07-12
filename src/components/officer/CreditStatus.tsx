import React from 'react';
import { CreditCard, TrendingUp, Calendar, DollarSign, Plus, BarChart3 } from 'lucide-react';

const CreditStatus = () => {
  const creditData = {
    current: 45,
    initial: 50,
    used: 5,
    plan: 'Police',
    monthlyFee: 500,
    renewalDate: '2025-02-12',
    daysRemaining: 31
  };

  const usageHistory = [
    { date: '2025-01-12', queries: 3, credits: 1, types: ['OSINT', 'RC', 'OSINT'] },
    { date: '2025-01-11', queries: 2, credits: 2, types: ['PRO', 'RC'] },
    { date: '2025-01-10', queries: 1, credits: 0, types: ['OSINT'] },
    { date: '2025-01-09', queries: 4, credits: 2, types: ['RC', 'OSINT', 'PRO', 'OSINT'] },
    { date: '2025-01-08', queries: 0, credits: 0, types: [] },
  ];

  const apiRates = [
    { name: 'OSINT', type: 'FREE', rate: 0, description: 'Open Source Intelligence' },
    { name: 'RC Check', type: 'PRO', rate: 1, description: 'Vehicle Registration' },
    { name: 'Cell ID', type: 'PRO', rate: 1, description: 'Cell Tower Location' },
    { name: 'PRO Query', type: 'PRO', rate: 2, description: 'Advanced Data Enrichment' },
    { name: 'Fastag', type: 'DISABLED', rate: 1, description: 'Not available for your plan' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Credit Status</h1>
        <p className="mt-1 text-sm text-slate-600">Monitor your credit usage and subscription details</p>
      </div>

      {/* Credit Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Available Credits</p>
              <p className="text-3xl font-bold text-blue-600">{creditData.current}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(creditData.current / creditData.initial) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {creditData.used} of {creditData.initial} used
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Plan</p>
              <p className="text-xl font-bold text-slate-900">{creditData.plan}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-slate-600 mt-2">₹{creditData.monthlyFee}/month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Renewal Date</p>
              <p className="text-lg font-bold text-slate-900">{creditData.renewalDate}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-slate-600 mt-2">{creditData.daysRemaining} days remaining</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">This Month</p>
              <p className="text-3xl font-bold text-slate-900">{creditData.used}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 20% vs last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage History */}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Recent Usage</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {usageHistory.map((day, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{day.date}</span>
                      <span className="text-xs text-slate-500">
                        {day.queries} queries
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {day.types.map((type, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {type}
                        </span>
                      ))}
                      {day.types.length === 0 && (
                        <span className="text-xs text-slate-400">No queries</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-900">{day.credits}</span>
                    <span className="text-xs text-slate-500 ml-1">credits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Rates */}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">API Rates</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {apiRates.map((api, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{api.name}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        api.type === 'FREE' ? 'bg-green-100 text-green-800' :
                        api.type === 'PRO' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {api.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{api.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-slate-900">
                      {api.type === 'DISABLED' ? 'N/A' : 
                       api.rate === 0 ? 'Free' : `${api.rate} credit${api.rate > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Credit Management</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-center">
              <Plus className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Buy Additional Credits</p>
              <p className="text-xs text-blue-700 mt-1">Top up your account</p>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Renew Subscription</p>
              <p className="text-xs text-green-700 mt-1">Extend your plan</p>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-center">
              <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Usage Analytics</p>
              <p className="text-xs text-purple-700 mt-1">Detailed reports</p>
            </button>
          </div>
        </div>
      </div>

      {/* Low Credit Warning */}
      {creditData.current <= 10 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-800">Low Credit Balance</h3>
              <p className="text-sm text-amber-700 mt-1">
                You have only {creditData.current} credits remaining. Consider purchasing additional credits to avoid service interruption.
              </p>
              <button className="mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline">
                Buy Credits Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditStatus;