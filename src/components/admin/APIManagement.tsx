import React, { useState } from 'react';
import { Settings, Plus, Edit, ToggleLeft, ToggleRight, DollarSign, Activity } from 'lucide-react';

const APIManagement = () => {
  const [apis, setApis] = useState([
    {
      id: '1',
      name: 'OSINT',
      type: 'FREE',
      provider: 'Internal',
      buyPrice: 0,
      sellPrice: 0,
      enabled: true,
      usage: 156,
      limit: 1000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Prefill',
      type: 'PRO',
      provider: 'Signzy',
      buyPrice: 6,
      sellPrice: 10,
      enabled: true,
      usage: 89,
      limit: 500,
      status: 'active'
    },
    {
      id: '3',
      name: 'Phone-to-Credit',
      type: 'PRO',
      provider: 'PlanAPI',
      buyPrice: 8,
      sellPrice: 12,
      enabled: true,
      usage: 45,
      limit: 300,
      status: 'active'
    },
    {
      id: '4',
      name: 'LeakOSINT',
      type: 'FREE',
      provider: 'SpiderFoot',
      buyPrice: 0,
      sellPrice: 0,
      enabled: true,
      usage: 23,
      limit: 200,
      status: 'active'
    },
    {
      id: '5',
      name: 'Fastag',
      type: 'PRO',
      provider: 'Custom',
      buyPrice: 5,
      sellPrice: 8,
      enabled: false,
      usage: 0,
      limit: 100,
      status: 'disabled'
    },
    {
      id: '6',
      name: 'SDR Manual',
      type: 'MANUAL',
      provider: 'Manual Process',
      buyPrice: 0,
      sellPrice: 50,
      enabled: true,
      usage: 12,
      limit: 50,
      status: 'active'
    }
  ]);

  const toggleAPI = (id: string) => {
    setApis(apis.map(api => 
      api.id === id ? { ...api, enabled: !api.enabled, status: api.enabled ? 'disabled' : 'active' } : api
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Management</h1>
          <p className="mt-1 text-sm text-slate-600">Configure API modules, pricing, and rate limits</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add API
        </button>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total APIs</p>
              <p className="text-2xl font-bold text-slate-900">{apis.length}</p>
            </div>
            <Settings className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{apis.filter(api => api.enabled).length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">PRO APIs</p>
              <p className="text-2xl font-bold text-purple-600">{apis.filter(api => api.type === 'PRO').length}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Usage</p>
              <p className="text-2xl font-bold text-slate-900">{apis.reduce((sum, api) => sum + api.usage, 0)}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* API List */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">API Modules</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  API Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {apis.map((api) => (
                <tr key={api.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{api.name}</div>
                      <div className="text-sm text-slate-500">{api.provider}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      api.type === 'FREE' ? 'bg-green-100 text-green-800' :
                      api.type === 'PRO' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {api.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {api.type === 'FREE' ? (
                      <span className="text-sm text-slate-500">Free</span>
                    ) : (
                      <div className="text-sm">
                        <div className="text-slate-900">Buy: ₹{api.buyPrice}</div>
                        <div className="text-slate-500">Sell: ₹{api.sellPrice}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{api.usage}/{api.limit}</div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(api.usage / api.limit) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      api.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {api.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAPI(api.id)}
                        className={`${api.enabled ? 'text-green-600' : 'text-slate-400'} hover:text-slate-700`}
                      >
                        {api.enabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rate Configuration */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Rate Configuration</h2>
          <p className="text-sm text-slate-600">Global rate settings and API limits</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Credit Conversion Rate</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">₹</span>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-slate-600">= 1 Credit</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rate Limit (per minute)</label>
              <input
                type="number"
                defaultValue="60"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Daily Query Limit</label>
              <input
                type="number"
                defaultValue="500"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Concurrent Requests</label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIManagement;