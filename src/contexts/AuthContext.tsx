import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'officer';
  plan?: string;
  credits?: number;
  deviceFingerprint?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('pickme_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const generateDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    const fingerprint = canvas.toDataURL();
    return btoa(fingerprint + navigator.userAgent + screen.width + screen.height);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    const deviceFingerprint = generateDeviceFingerprint();
    
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        username: 'admin',
        role: 'admin',
        deviceFingerprint,
        lastLogin: new Date().toISOString()
      };
      setUser(adminUser);
      localStorage.setItem('pickme_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    } else if (username === 'officer1' && password === 'officer123') {
      const officerUser: User = {
        id: '2',
        username: 'officer1',
        role: 'officer',
        plan: 'Police',
        credits: 45,
        deviceFingerprint,
        lastLogin: new Date().toISOString()
      };
      setUser(officerUser);
      localStorage.setItem('pickme_user', JSON.stringify(officerUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pickme_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};