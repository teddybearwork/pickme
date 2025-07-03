import React, { useState, useEffect } from 'react';
import { Search, CreditCard, History, User, LogOut, Zap, Phone, Mail, Globe, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useOfficerAuth } from '../contexts/OfficerAuthContext';

interface QueryResult {
  id: string;
  type: 'OSINT' | 'PRO';
  input: string;
  result_summary: string;
  credits_used: number;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Processing';
}

export const OfficerDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { officer, logout } = useOfficerAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState<'OSINT' | 'PRO'>('OSINT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!officer) {
      navigate('/officer/login');
    }
  }, [officer, navigate]);

  // Mock data
  useEffect(() => {
    setResults([
      {
        id: '1',
        type: 'PRO',
        input: '9791103607',
        result_summary: 'Phone owner: John Doe, Location: Chennai',
        credits_used: 2,
        timestamp: '2025-01-03 15:22',
        status: 'Success'
      },
      {
        id: '2',
        type: 'OSINT',
        input: 'john.doe@email.com',
        result_summary: 'Social profiles found on LinkedIn, Facebook',
        credits_used: 0,
        timestamp: '2025-01-03 14:45',
        status: 'Success'
      }
    ]);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newResult: QueryResult = {
        id: Date.now().toString(),
        type: queryType,
        input: query,
        result_summary: `Mock result for ${query}`,
        credits_used: queryType === 'PRO' ? 2 : 0,
        timestamp: new Date().toLocaleString(),
        status: 'Success'
      };
      
      setResults(prev => [newResult, ...prev]);
      setQuery('');
      setIsProcessing(false);
    }, 2000);
  };

  const getQueryIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'social':
        return <Globe className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const detectQueryType = (input: string) => {
    if (/^\+?[1-9]\d{1,14}$/.test(input.replace(/\s/g, ''))) return 'phone';
    if (/\S+@\S+\.\S+/.test(input)) return 'email';
    if (input.includes('@') && !input.includes('.')) return 'social';
    return 'general';
  };

  if (!officer) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-crisp-black' : 'bg-soft-white'}`}>
      {/* Header */}
      <div className={`border-b border-cyber-teal/20 ${isDark ? 'bg-muted-graphite' : 'bg-white'}`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className={`p-2 transition-colors ${
                  isDark ? 'text-gray-400 hover:text-cyber-teal' : 'text-gray-600 hover:text-cyber-teal'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-cyber-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  PickMe Intelligence
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Officer Portal
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className={`p-2 transition-colors ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-400'}`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4">
        <div className={`border border-cyber-teal/20 rounded-lg p-4 ${
          isDark ? 'bg-muted-graphite' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-cyber-gradient rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {officer.name}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {officer.mobile}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {officer.credits_remaining} Credits
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                of {officer.total_credits}
              </p>
            </div>
          </div>
          
          {/* Credit Progress */}
          <div className={`w-full rounded-full h-2 ${isDark ? 'bg-crisp-black' : 'bg-gray-200'}`}>
            <div 
              className="bg-cyber-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: `${(officer.credits_remaining / officer.total_credits) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4">
        <div className="flex space-x-1 mb-4">
          {[
            { id: 'search', name: 'Search', icon: Search },
            { id: 'history', name: 'History', icon: History },
            { id: 'credits', name: 'Credits', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/30'
                    : isDark 
                      ? 'text-gray-400 hover:text-cyber-teal hover:bg-cyber-teal/10' 
                      : 'text-gray-600 hover:text-cyber-teal hover:bg-cyber-teal/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {activeTab === 'search' && (
          <div className="space-y-4">
            {/* Query Type Selector */}
            <div className="flex space-x-2">
              <button
                onClick={() => setQueryType('OSINT')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  queryType === 'OSINT'
                    ? 'bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/30'
                    : isDark 
                      ? 'bg-muted-graphite text-gray-400 border border-gray-600' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                OSINT (Free)
              </button>
              <button
                onClick={() => setQueryType('PRO')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  queryType === 'PRO'
                    ? 'bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/30'
                    : isDark 
                      ? 'bg-muted-graphite text-gray-400 border border-gray-600' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                PRO (2 Credits)
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter phone number, email, or search query..."
                  className={`w-full px-4 py-3 border border-cyber-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal focus:border-transparent ${
                    isDark 
                      ? 'bg-crisp-black text-white placeholder-gray-500' 
                      : 'bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getQueryIcon(detectQueryType(query))}
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!query.trim() || isProcessing}
                className="w-full py-3 px-4 bg-cyber-gradient text-white font-medium rounded-lg hover:shadow-cyber transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setQuery('9791103607')}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isDark 
                    ? 'bg-muted-graphite border-cyber-teal/20 text-gray-300 hover:border-cyber-teal/40' 
                    : 'bg-white border-gray-200 text-gray-700 hover:border-cyber-teal/40'
                }`}
              >
                <Phone className="w-5 h-5 mx-auto mb-1 text-cyber-teal" />
                <p className="text-xs">Phone Lookup</p>
              </button>
              <button
                onClick={() => setQuery('example@email.com')}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isDark 
                    ? 'bg-muted-graphite border-cyber-teal/20 text-gray-300 hover:border-cyber-teal/40' 
                    : 'bg-white border-gray-200 text-gray-700 hover:border-cyber-teal/40'
                }`}
              >
                <Mail className="w-5 h-5 mx-auto mb-1 text-cyber-teal" />
                <p className="text-xs">Email Search</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className={`border border-cyber-teal/20 rounded-lg p-4 ${
                isDark ? 'bg-muted-graphite' : 'bg-white'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.type === 'PRO' 
                        ? 'bg-neon-magenta/20 text-neon-magenta' 
                        : 'bg-cyber-teal/20 text-cyber-teal'
                    }`}>
                      {result.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.status === 'Success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {result.timestamp}
                  </span>
                </div>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {result.input}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {result.result_summary}
                </p>
                {result.credits_used > 0 && (
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Credits used: {result.credits_used}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-4">
            <div className={`border border-cyber-teal/20 rounded-lg p-4 ${
              isDark ? 'bg-muted-graphite' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Credit Balance
              </h3>
              <div className="text-center">
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {officer.credits_remaining}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  of {officer.total_credits} credits remaining
                </p>
              </div>
            </div>

            <div className={`border border-cyber-teal/20 rounded-lg p-4 ${
              isDark ? 'bg-muted-graphite' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Credit Costs
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>OSINT Queries:</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Phone Verification:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>2 credits</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Identity Verification:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>3 credits</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Email Verification:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>1 credit</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};