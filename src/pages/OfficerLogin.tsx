import React, { useState } from 'react';
import { Shield, Zap, Phone, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useOfficerAuth } from '../contexts/OfficerAuthContext';
import toast from 'react-hot-toast';

export const OfficerLogin: React.FC = () => {
  const { isDark } = useTheme();
  const { login } = useOfficerAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'telegram'>('mobile');
  const [mobile, setMobile] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    const identifier = loginMethod === 'mobile' ? mobile : telegramId;
    
    if (!identifier.trim()) {
      toast.error(`Please enter your ${loginMethod === 'mobile' ? 'mobile number' : 'Telegram ID'}`);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtp(true);
      setIsSubmitting(false);
      toast.success('OTP sent successfully!');
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const identifier = loginMethod === 'mobile' ? mobile : telegramId;
      await login(identifier, otp);
      toast.success('Login successful!');
      navigate('/officer/dashboard');
    } catch (error) {
      toast.error('Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark ? 'bg-dark-gradient' : 'bg-gradient-to-br from-soft-white to-gray-100'
    }`}>
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="flex items-center">
          <Link
            to="/"
            className={`flex items-center space-x-2 text-sm transition-colors ${
              isDark ? 'text-gray-400 hover:text-cyber-teal' : 'text-gray-600 hover:text-cyber-teal'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-cyber-gradient rounded-xl flex items-center justify-center shadow-cyber">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className={`mt-6 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Officer Portal
          </h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            PickMe Intelligence - Law Enforcement Access
          </p>
          <div className="flex items-center justify-center mt-3 space-x-2">
            <Zap className="w-4 h-4 text-electric-blue" />
            <span className="text-xs text-electric-blue">Secure Officer Login</span>
          </div>
        </div>

        {/* Login Form */}
        <div className={`rounded-xl shadow-xl p-8 border ${
          isDark 
            ? 'bg-muted-graphite border-cyber-teal/20' 
            : 'bg-white border-gray-200'
        }`}>
          {!showOtp ? (
            <div className="space-y-6">
              {/* Login Method Selector */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setLoginMethod('mobile')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    loginMethod === 'mobile'
                      ? 'bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/30'
                      : isDark 
                        ? 'bg-crisp-black text-gray-400 border border-gray-600' 
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Mobile</span>
                </button>
                <button
                  onClick={() => setLoginMethod('telegram')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    loginMethod === 'telegram'
                      ? 'bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/30'
                      : isDark 
                        ? 'bg-crisp-black text-gray-400 border border-gray-600' 
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Telegram</span>
                </button>
              </div>

              {/* Input Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {loginMethod === 'mobile' ? 'Mobile Number' : 'Telegram ID'}
                </label>
                <div className="relative">
                  {loginMethod === 'mobile' ? (
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  ) : (
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  )}
                  <input
                    type={loginMethod === 'mobile' ? 'tel' : 'text'}
                    value={loginMethod === 'mobile' ? mobile : telegramId}
                    onChange={(e) => loginMethod === 'mobile' ? setMobile(e.target.value) : setTelegramId(e.target.value)}
                    placeholder={loginMethod === 'mobile' ? '+91 9791103607' : '@rameshcop'}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal focus:border-transparent transition-all duration-200 ${
                      isDark 
                        ? 'bg-crisp-black border-cyber-teal/30 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-cyber-gradient text-white font-medium rounded-lg hover:shadow-cyber transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Verify OTP
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter the 6-digit code sent to {loginMethod === 'mobile' ? mobile : telegramId}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-teal focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest ${
                    isDark 
                      ? 'bg-crisp-black border-cyber-teal/30 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-cyber-gradient text-white font-medium rounded-lg hover:shadow-cyber transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowOtp(false)}
                className={`w-full py-2 text-sm transition-colors ${
                  isDark ? 'text-gray-400 hover:text-cyber-teal' : 'text-gray-600 hover:text-cyber-teal'
                }`}
              >
                ← Back to login
              </button>
            </div>
          )}

          {/* Demo Credentials */}
          <div className={`mt-6 p-4 rounded-lg border ${
            isDark 
              ? 'bg-crisp-black/50 border-cyber-teal/20' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs">
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Mobile: <span className="text-cyber-teal">+91 9791103607</span>
              </p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Telegram: <span className="text-cyber-teal">@rameshcop</span>
              </p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                OTP: <span className="text-cyber-teal">123456</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2025 PickMe Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};