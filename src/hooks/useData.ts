import { useState, useEffect } from 'react';
import { Officer, QueryRequest, CreditTransaction, APIKey, LiveRequest, DashboardStats } from '../types';

// Mock data generators
export const generateMockOfficers = (): Officer[] => {
  return [
    {
      id: '1',
      name: 'Inspector Ramesh Kumar',
      mobile: '+91 9791103607',
      telegram_id: '@rameshcop',
      status: 'Active',
      registered_on: '2025-06-20',
      last_active: '2025-06-28 15:22',
      credits_remaining: 32,
      total_credits: 50,
      total_queries: 146,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '2',
      name: 'ASI Priya Sharma',
      mobile: '+91 9876543210',
      telegram_id: '@priyacop',
      status: 'Active',
      registered_on: '2025-06-15',
      last_active: '2025-06-28 14:45',
      credits_remaining: 45,
      total_credits: 50,
      total_queries: 89,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '3',
      name: 'SI Rajesh Patel',
      mobile: '+91 9123456789',
      telegram_id: '@rajeshcop',
      status: 'Suspended',
      registered_on: '2025-06-10',
      last_active: '2025-06-25 10:30',
      credits_remaining: 12,
      total_credits: 50,
      total_queries: 203,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: '4',
      name: 'Constable Anita Singh',
      mobile: '+91 9987654321',
      telegram_id: '@anitacop',
      status: 'Active',
      registered_on: '2025-06-22',
      last_active: '2025-06-28 16:10',
      credits_remaining: 38,
      total_credits: 50,
      total_queries: 67,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];
};

export const generateMockQueries = (): QueryRequest[] => {
  return [
    {
      id: '1',
      officer_id: '1',
      officer_name: 'Inspector Ramesh Kumar',
      type: 'PRO',
      input: '9791103607',
      source: 'Signzy API',
      result_summary: 'Phone owner details found',
      credits_used: 2,
      timestamp: '2025-06-28 15:22',
      status: 'Success'
    },
    {
      id: '2',
      officer_id: '2',
      officer_name: 'ASI Priya Sharma',
      type: 'OSINT',
      input: 'john.doe@email.com',
      source: 'Social Media Scraper',
      result_summary: 'Social profiles located',
      credits_used: 0,
      timestamp: '2025-06-28 14:45',
      status: 'Success'
    },
    {
      id: '3',
      officer_id: '4',
      officer_name: 'Constable Anita Singh',
      type: 'PRO',
      input: 'AADHAAR123456789',
      source: 'Surepass API',
      result_summary: 'Verification failed',
      credits_used: 1,
      timestamp: '2025-06-28 16:10',
      status: 'Failed'
    }
  ];
};

export const generateMockTransactions = (): CreditTransaction[] => {
  return [
    {
      id: '1',
      officer_id: '1',
      officer_name: 'Inspector Ramesh Kumar',
      action: 'Renewal',
      credits: 50,
      payment_mode: 'Department Budget',
      remarks: 'Monthly renewal',
      timestamp: '2025-06-01 09:00'
    },
    {
      id: '2',
      officer_id: '1',
      officer_name: 'Inspector Ramesh Kumar',
      action: 'Deduction',
      credits: -2,
      payment_mode: 'PRO Query',
      remarks: 'Signzy API call',
      timestamp: '2025-06-28 15:22'
    }
  ];
};

export const generateMockAPIKeys = (): APIKey[] => {
  return [
    {
      id: '1',
      name: 'Signzy Phone Verification',
      provider: 'Signzy',
      key: 'sk_test_****************************',
      status: 'Active',
      last_used: '2025-06-28 15:22',
      usage_count: 1245
    },
    {
      id: '2',
      name: 'Surepass Identity Verification',
      provider: 'Surepass',
      key: 'sp_live_****************************',
      status: 'Active',
      last_used: '2025-06-28 16:10',
      usage_count: 856
    }
  ];
};

export const generateMockLiveRequests = (): LiveRequest[] => {
  return [
    {
      id: '1',
      timestamp: '2025-06-28 16:25',
      officer: '+91 9791103607',
      type: 'PRO',
      query: 'Phone Credit History',
      status: 'Processing'
    },
    {
      id: '2',
      timestamp: '2025-06-28 16:24',
      officer: '+91 9876543210',
      type: 'OSINT',
      query: 'Social Media Profile',
      status: 'Success'
    }
  ];
};

export const generateMockDashboardStats = (): DashboardStats => {
  return {
    total_officers: 156,
    active_officers: 142,
    total_queries_today: 1247,
    successful_queries: 1189,
    failed_queries: 58,
    total_credits_used: 2438,
    revenue_today: 48760,
    average_response_time: 1.8
  };
};

export const useData = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [queries, setQueries] = useState<QueryRequest[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  const [liveRequests, setLiveRequests] = useState<LiveRequest[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOfficers(generateMockOfficers());
      setQueries(generateMockQueries());
      setTransactions(generateMockTransactions());
      setAPIKeys(generateMockAPIKeys());
      setLiveRequests(generateMockLiveRequests());
      setDashboardStats(generateMockDashboardStats());
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Simulate live request updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRequests(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const statuses: ('Processing' | 'Success' | 'Failed')[] = ['Processing', 'Success', 'Failed'];
          updated[randomIndex].status = statuses[Math.floor(Math.random() * statuses.length)];
        }
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    officers,
    queries,
    transactions,
    apiKeys,
    liveRequests,
    dashboardStats,
    isLoading,
    setOfficers,
    setQueries,
    setTransactions,
    setAPIKeys
  };
};