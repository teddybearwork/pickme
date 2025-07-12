import React, { useState } from 'react';
import { Search, Send, Loader, AlertCircle, CheckCircle, Info } from 'lucide-react';

const QueryInterface = () => {
  const [queryType, setQueryType] = useState('OSINT');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const queryTypes = [
    { value: 'OSINT', label: 'OSINT Query', description: 'Open Source Intelligence lookup', credits: 0, type: 'FREE' },
    { value: 'RC', label: 'RC Check', description: 'Vehicle registration details', credits: 1, type: 'PRO' },
    { value: 'CELLID', label: 'Cell ID', description: 'Cell tower location lookup', credits: 1, type: 'PRO' },
    { value: 'PRO', label: 'PRO Query', description: 'Advanced data enrichment', credits: 2, type: 'PRO' },
    { value: 'FASTAG', label: 'Fastag', description: 'Fastag details lookup', credits: 1, type: 'PRO' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on query type
      if (queryType === 'OSINT') {
        setResult({
          phone: input,
          name: 'John Doe',
          socialMedia: ['Facebook', 'Instagram'],
          apps: ['Zomato', 'Uber', 'Google Pay'],
          tags: ['Verified', 'Active User'],
          location: 'Mumbai, Maharashtra'
        });
      } else if (queryType === 'RC') {
        setResult({
          vehicle: input,
          owner: 'ABC Transport Pvt Ltd',
          model: 'Maruti Swift Dzire',
          year: '2022',
          fuel: 'Petrol',
          status: 'Active',
          insurance: 'Valid till Dec 2025'
        });
      } else {
        setResult({
          query: input,
          status: 'Data found',
          details: 'Query processed successfully',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      setError('Query failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedQuery = queryTypes.find(q => q.value === queryType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Query Interface</h1>
        <p className="mt-1 text-sm text-slate-600">Perform intelligence queries and data lookups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-900">New Query</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Query Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {queryTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-colors ${
                        queryType === type.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="queryType"
                        value={type.value}
                        checked={queryType === type.value}
                        onChange={(e) => setQueryType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">{type.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              type.type === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {type.type}
                            </span>
                            {type.credits > 0 && (
                              <span className="text-xs text-slate-500">{type.credits} credits</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 mt-1">{type.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="input" className="block text-sm font-medium text-slate-700 mb-2">
                  Input Data
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      queryType === 'OSINT' ? 'Enter phone number (e.g., 9848012345)' :
                      queryType === 'RC' ? 'Enter vehicle number (e.g., TN09AB1234)' :
                      queryType === 'CELLID' ? 'Enter cell tower ID (e.g., Tower-4521)' :
                      'Enter query data'
                    }
                    required
                  />
                </div>
              </div>

              {selectedQuery && selectedQuery.credits > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800">
                        This query will consume <strong>{selectedQuery.credits} credits</strong> from your account.
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Current balance: 45 credits
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Processing Query...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Execute Query
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-900">Results</h2>
            </div>
            <div className="p-6">
              {isLoading && (
                <div className="text-center py-8">
                  <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-sm text-slate-600">Processing your query...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Query Successful</span>
                  </div>

                  {queryType === 'OSINT' && (
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900">📞 Phone: {result.phone}</h3>
                        <p className="text-sm text-slate-600">Name: {result.name}</p>
                        <p className="text-sm text-slate-600">Location: {result.location}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-slate-700 mb-1">Social Media:</h4>
                        <div className="flex flex-wrap gap-1">
                          {result.socialMedia.map((platform: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-slate-700 mb-1">Apps:</h4>
                        <div className="flex flex-wrap gap-1">
                          {result.apps.map((app: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {queryType === 'RC' && (
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Vehicle:</span> {result.vehicle}</p>
                      <p className="text-sm"><span className="font-medium">Owner:</span> {result.owner}</p>
                      <p className="text-sm"><span className="font-medium">Model:</span> {result.model}</p>
                      <p className="text-sm"><span className="font-medium">Year:</span> {result.year}</p>
                      <p className="text-sm"><span className="font-medium">Fuel:</span> {result.fuel}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> {result.status}</p>
                      <p className="text-sm"><span className="font-medium">Insurance:</span> {result.insurance}</p>
                    </div>
                  )}

                  {!['OSINT', 'RC'].includes(queryType) && (
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Query:</span> {result.query}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> {result.status}</p>
                      <p className="text-sm"><span className="font-medium">Details:</span> {result.details}</p>
                      <p className="text-xs text-slate-500">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}

              {!isLoading && !error && !result && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">Submit a query to see results here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryInterface;