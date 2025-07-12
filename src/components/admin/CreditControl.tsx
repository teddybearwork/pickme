import React, { useState } from 'react';
import { CreditCard, TrendingUp, Users, DollarSign, Plus, Edit } from 'lucide-react';

const CreditControl = () => {
  const [plans, setPlans] = useState([
    {
      id: '1',
      name: 'Police',
      monthlyFee: 500,
      defaultCredits: 50,
      renewalRequired: true,
      allowedAPIs: ['OSINT', 'Prefill', 'Phone-to-Credit', 'LeakOSINT'],
      activeUsers: 12,
      totalRevenue: 6000
    },
    {
      id: '2',
      name: 'Private Agency',
      monthlyFee: 10000,
      defaultCredits: 200,
      renewalRequired: true,
      allowedAPIs: ['OSINT', 'Prefill', 'Phone-to-Credit', 'LeakOSINT', 'Fastag'],
      activeUsers: 5,
      totalRevenue: 50000
    },
    {
      id: '3',
      name: 'Demo',
      monthlyFee: 0,
      defaultCredits: 10,
      renewalRequired: false,
      allowedAPIs: ['OSINT', 'LeakOSINT'],
      activeUsers: 8,
      totalRevenue: 0
    }
  ]);

  const [showAddPlan, setShowAddPlan] = useState(false);

  const totalRevenue = plans.reduce((sum, plan) => sum + plan.totalRevenue, 0);
  const totalUsers = plans.reduce((sum, plan) => sum + plan.activeUsers, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Credit Control</h1>
          <p className="mt-1 text-sm text-slate-600">Manage subscription plans and billing</p>
        </div>
        <button
          onClick={() => setShowAddPlan(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Plans</p>
              <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">+23%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Plans Management */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Subscription Plans</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Monthly Fee:</span>
                    <span className="text-sm font-medium text-slate-900">
                      {plan.monthlyFee === 0 ? 'Free' : `₹${plan.monthlyFee.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Default Credits:</span>
                    <span className="text-sm font-medium text-slate-900">{plan.defaultCredits}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Active Users:</span>
                    <span className="text-sm font-medium text-slate-900">{plan.activeUsers}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Revenue:</span>
                    <span className="text-sm font-medium text-slate-900">₹{plan.totalRevenue.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-slate-600">Allowed APIs:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {plan.allowedAPIs.map((api, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {api}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Renewal Required:</span>
                    <span className={`text-sm font-medium ${plan.renewalRequired ? 'text-green-600' : 'text-slate-600'}`}>
                      {plan.renewalRequired ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom API Rates */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Custom API Rates</h2>
          <p className="text-sm text-slate-600">Override default API pricing for specific plans</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  API Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Default Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Police Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Private Agency Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Prefill</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₹10</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="number" defaultValue="8" className="w-20 px-2 py-1 border border-slate-300 rounded text-sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="number" defaultValue="10" className="w-20 px-2 py-1 border border-slate-300 rounded text-sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">Save</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Phone-to-Credit</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₹12</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="number" defaultValue="10" className="w-20 px-2 py-1 border border-slate-300 rounded text-sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="number" defaultValue="12" className="w-20 px-2 py-1 border border-slate-300 rounded text-sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">Save</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Fastag</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₹8</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-400">Not Available</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="number" defaultValue="8" className="w-20 px-2 py-1 border border-slate-300 rounded text-sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">Save</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Add New Plan</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Premium Agency"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Credits</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Allowed APIs</label>
                <div className="space-y-2">
                  {['OSINT', 'Prefill', 'Phone-to-Credit', 'LeakOSINT', 'Fastag', 'SDR Manual'].map((api) => (
                    <label key={api} className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-slate-700">{api}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-slate-700">Renewal Required</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPlan(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditControl;