import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (success) {
      const userRole = username === 'admin' ? 'admin' : 'officer';
      navigate(`/${userRole}`);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-accent-900 to-secondary-900 dark:from-secondary-950 dark:via-primary-950 dark:to-accent-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-glow-lg animate-float">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold font-display text-white mb-2 text-shadow-lg">
            PickMe Intelligence
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <p className="text-primary-200 font-medium">Secure Law Enforcement Portal</p>
            <Sparkles className="h-4 w-4 text-accent-400" />
          </div>
          <div className="glass-effect p-4 rounded-2xl border border-white/20">
            <p className="text-sm text-primary-200 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-xs text-primary-300">Admin: admin / admin123</p>
              <p className="text-xs text-primary-300">Officer: officer1 / officer123</p>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6 animate-slide-up" onSubmit={handleSubmit}>
          <div className="glass-effect rounded-2xl p-8 border border-white/20 shadow-large">
            {error && (
              <div className="mb-6 p-4 bg-danger-500/20 border border-danger-500/50 rounded-xl flex items-center gap-3 animate-scale-in">
                <AlertCircle className="h-5 w-5 text-danger-400" />
                <span className="text-danger-200 text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-primary-200 mb-3">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 font-medium"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-primary-200 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 font-medium"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:from-primary-700 disabled:to-accent-700 text-white font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-glow hover:shadow-glow-lg active:scale-95 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="font-semibold">Authenticating...</span>
                </div>
              ) : (
                <span className="font-semibold">Sign In Securely</span>
              )}
            </button>

            <div className="mt-8 text-center">
              <p className="text-xs text-primary-300 font-medium">
                Secure single-device authentication • Device fingerprinting enabled
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;