import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface OfficerUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  telegram_id?: string;
  credits_remaining: number;
  total_credits: number;
  status: string;
  department?: string;
  rank?: string;
  badge_number?: string;
}

interface OfficerAuthContextType {
  officer: OfficerUser | null;
  login: (identifier: string, password: string) => Promise<void>;
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

// Mock officer database
const mockOfficers = [
  {
    id: '1',
    name: 'Inspector Ramesh Kumar',
    mobile: '+91 9791103607',
    email: 'ramesh@police.gov.in',
    password: 'officer123',
    telegram_id: '@rameshcop',
    credits_remaining: 32,
    total_credits: 50,
    status: 'Active',
    department: 'Cyber Crime',
    rank: 'Inspector',
    badge_number: 'CC001'
  },
  {
    id: '2',
    name: 'ASI Priya Sharma',
    mobile: '+91 9876543210',
    email: 'priya@police.gov.in',
    password: 'officer123',
    telegram_id: '@priyacop',
    credits_remaining: 45,
    total_credits: 50,
    status: 'Active',
    department: 'Intelligence',
    rank: 'Assistant Sub Inspector',
    badge_number: 'INT002'
  },
  {
    id: '3',
    name: 'SI Rajesh Patel',
    mobile: '+91 9123456789',
    email: 'rajesh@police.gov.in',
    password: 'officer123',
    telegram_id: '@rajeshcop',
    credits_remaining: 12,
    total_credits: 50,
    status: 'Active',
    department: 'Crime Branch',
    rank: 'Sub Inspector',
    badge_number: 'CB003'
  }
];

export const OfficerAuthProvider: React.FC<OfficerAuthProviderProps> = ({ children }) => {
  const [officer, setOfficer] = useState<OfficerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedOfficer = localStorage.getItem('officer_auth_user');
    if (storedOfficer) {
      try {
        const officerData = JSON.parse(storedOfficer);
        setOfficer(officerData);
      } catch (error) {
        localStorage.removeItem('officer_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find officer in mock database
    const foundOfficer = mockOfficers.find(o => 
      (o.email === identifier || o.mobile === identifier || o.mobile.replace('+91 ', '') === identifier) && 
      o.password === password
    );
    
    if (foundOfficer) {
      const officerData: OfficerUser = {
        id: foundOfficer.id,
        name: foundOfficer.name,
        mobile: foundOfficer.mobile,
        email: foundOfficer.email,
        telegram_id: foundOfficer.telegram_id,
        credits_remaining: foundOfficer.credits_remaining,
        total_credits: foundOfficer.total_credits,
        status: foundOfficer.status,
        department: foundOfficer.department,
        rank: foundOfficer.rank,
        badge_number: foundOfficer.badge_number
      };
      
      setOfficer(officerData);
      localStorage.setItem('officer_auth_user', JSON.stringify(officerData));
      toast.success(`Welcome back, ${officerData.name}!`);
    } else {
      toast.error('Invalid credentials');
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setOfficer(null);
    localStorage.removeItem('officer_auth_user');
    toast.success('Logged out successfully');
  };

  return (
    <OfficerAuthContext.Provider value={{ officer, login, logout, isLoading }}>
      {children}
    </OfficerAuthContext.Provider>
  );
};