import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OfficerUser {
  id: string;
  name: string;
  mobile: string;
  telegram_id?: string;
  credits_remaining: number;
  total_credits: number;
  status: string;
}

interface OfficerAuthContextType {
  officer: OfficerUser | null;
  login: (identifier: string, otp: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const OfficerAuthContext = createContext<OfficerAuthContextType | undefined>(undefined);

export const useOfficerAuth = () => {
  const context = useContext(OfficerAuthContext);
  if (!context) {
    throw new Error('useOfficerAuth must be used within an OfficerAuthProvider');
  }
  return context;
};

interface OfficerAuthProviderProps {
  children: ReactNode;
}

export const OfficerAuthProvider: React.FC<OfficerAuthProviderProps> = ({ children }) => {
  const [officer, setOfficer] = useState<OfficerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('officer_auth_token');
    if (token) {
      // Simulate user verification
      setTimeout(() => {
        setOfficer({
          id: '1',
          name: 'Inspector Ramesh Kumar',
          mobile: '+91 9791103607',
          telegram_id: '@rameshcop',
          credits_remaining: 32,
          total_credits: 50,
          status: 'Active'
        });
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, otp: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otp === '123456') {
      const mockOfficer: OfficerUser = {
        id: '1',
        name: 'Inspector Ramesh Kumar',
        mobile: identifier.includes('@') ? '+91 9791103607' : identifier,
        telegram_id: identifier.includes('@') ? identifier : '@rameshcop',
        credits_remaining: 32,
        total_credits: 50,
        status: 'Active'
      };
      
      setOfficer(mockOfficer);
      localStorage.setItem('officer_auth_token', 'mock-officer-jwt-token');
    } else {
      throw new Error('Invalid OTP');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setOfficer(null);
    localStorage.removeItem('officer_auth_token');
  };

  return (
    <OfficerAuthContext.Provider value={{ officer, login, logout, isLoading }}>
      {children}
    </OfficerAuthContext.Provider>
  );
};