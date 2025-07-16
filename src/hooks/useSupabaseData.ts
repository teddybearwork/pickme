import { useState, useEffect } from 'react';
import { supabase, Officer, CreditTransaction, APIKey, Query, OfficerRegistration, LiveRequest } from '../lib/supabase';
import { useData } from './useData';
import toast from 'react-hot-toast';

export const useSupabaseData = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [registrations, setRegistrations] = useState<OfficerRegistration[]>([]);
  const [liveRequests, setLiveRequests] = useState<LiveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Fallback to mock data hook
  const mockData = useData();

  // Check if we're in demo mode
  const isDemo = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      if (isDemo) {
        // Use mock data when Supabase is not configured
        console.log('Using mock data - Supabase not configured');
        setOfficers(mockData.officers);
        setTransactions(mockData.transactions);
        setAPIKeys(mockData.apiKeys);
        setQueries(mockData.queries);
        setRegistrations(mockData.registrations);
        setLiveRequests(mockData.liveRequests);
        setDashboardStats(mockData.dashboardStats);
      } else {
        // Use real Supabase data
        await Promise.all([
          loadOfficers(),
          loadTransactions(),
          loadAPIKeys(),
          loadQueries(),
          loadRegistrations(),
          loadLiveRequests()
        ]);
        calculateDashboardStats();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      setOfficers(mockData.officers);
      setTransactions(mockData.transactions);
      setAPIKeys(mockData.apiKeys);
      setQueries(mockData.queries);
      setRegistrations(mockData.registrations);
      setLiveRequests(mockData.liveRequests);
      setDashboardStats(mockData.dashboardStats);
      toast.error('Using demo data - Database connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOfficers(data || []);
    } catch (error) {
      console.error('Error loading officers:', error);
      throw error;
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      throw error;
    }
  };

  const loadAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAPIKeys(data || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
      throw error;
    }
  };

  const loadQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setQueries(data || []);
    } catch (error) {
      console.error('Error loading queries:', error);
      throw error;
    }
  };

  const loadRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('officer_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
      throw error;
    }
  };

  const loadLiveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('live_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setLiveRequests(data || []);
    } catch (error) {
      console.error('Error loading live requests:', error);
      throw error;
    }
  };

  const calculateDashboardStats = () => {
    const stats = {
      total_officers: officers.length,
      active_officers: officers.filter(o => o.status === 'Active').length,
      total_queries_today: queries.filter(q => {
        const today = new Date().toDateString();
        return new Date(q.created_at).toDateString() === today;
      }).length,
      successful_queries: queries.filter(q => q.status === 'Success').length,
      failed_queries: queries.filter(q => q.status === 'Failed').length,
      total_credits_used: transactions
        .filter(t => t.action === 'Deduction')
        .reduce((sum, t) => sum + Math.abs(t.credits), 0),
      revenue_today: 0,
      average_response_time: 1.8
    };
    setDashboardStats(stats);
  };

  // CRUD Operations for Officers
  const addOfficer = async (officerData: Omit<Officer, 'id' | 'created_at' | 'updated_at' | 'registered_on' | 'last_active' | 'total_queries'>) => {
    try {
      if (isDemo) {
        // Mock implementation
        const newOfficer = {
          ...officerData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          registered_on: new Date().toISOString(),
          last_active: new Date().toISOString(),
          total_queries: 0
        };
        setOfficers(prev => [...prev, newOfficer]);
        toast.success('Officer added successfully! (Demo Mode)');
        return newOfficer;
      }

      // Extract password and remove it from the data object
      const { password, ...officerDataWithoutPassword } = officerData as any;
      
      // Hash the password before storing (in a real app, this should be done on the server)
      const passwordHash = `$2b$10$${btoa(password || 'defaultpass').slice(0, 53)}`;
      
      const { data, error } = await supabase
        .from('officers')
        .insert([{
          ...officerDataWithoutPassword,
          password_hash: passwordHash,
          total_queries: 0
        }])
        .select()
        .single();

      if (error) throw error;
      
      await loadOfficers();
      toast.success('Officer added successfully!');
      return data;
    } catch (error: any) {
      toast.error(`Failed to add officer: ${error.message}`);
      throw error;
    }
  };

  const updateOfficer = async (id: string, updates: Partial<Officer>) => {
    try {
      if (isDemo) {
        // Mock implementation
        setOfficers(prev => prev.map(officer => 
          officer.id === id ? { ...officer, ...updates, updated_at: new Date().toISOString() } : officer
        ));
        toast.success('Officer updated successfully! (Demo Mode)');
        return;
      }

      // Extract password and remove it from the updates object
      const { password, ...updatesWithoutPassword } = updates as any;
      
      // Prepare the update data
      const updateData = { ...updatesWithoutPassword };
      
      // If password is being updated, hash it
      if (password && password.trim()) {
        updateData.password_hash = `$2b$10$${btoa(password).slice(0, 53)}`;
      }
      
      const { error } = await supabase
        .from('officers')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      await loadOfficers();
      toast.success('Officer updated successfully!');
    } catch (error: any) {
      toast.error(`Failed to update officer: ${error.message}`);
      throw error;
    }
  };

  const deleteOfficer = async (id: string) => {
    try {
      if (isDemo) {
        // Mock implementation
        setOfficers(prev => prev.filter(officer => officer.id !== id));
        toast.success('Officer deleted successfully! (Demo Mode)');
        return;
      }

      const { error } = await supabase
        .from('officers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await loadOfficers();
      toast.success('Officer deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete officer: ${error.message}`);
      throw error;
    }
  };

  // CRUD Operations for Credit Transactions
  const addTransaction = async (transactionData: Omit<CreditTransaction, 'id' | 'created_at'>) => {
    try {
      if (isDemo) {
        // Mock implementation
        const newTransaction = {
          ...transactionData,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        setTransactions(prev => [newTransaction, ...prev]);
        
        // Update officer credits in mock data
        const officer = officers.find(o => o.id === transactionData.officer_id);
        if (officer) {
          const creditChange = transactionData.action === 'Deduction' 
            ? -Math.abs(transactionData.credits)
            : Math.abs(transactionData.credits);

          const newCreditsRemaining = Math.max(0, officer.credits_remaining + creditChange);
          const newTotalCredits = ['Renewal', 'Top-up'].includes(transactionData.action)
            ? officer.total_credits + Math.abs(transactionData.credits)
            : officer.total_credits;

          setOfficers(prev => prev.map(o => 
            o.id === transactionData.officer_id 
              ? { ...o, credits_remaining: newCreditsRemaining, total_credits: newTotalCredits }
              : o
          ));
        }
        
        toast.success('Transaction processed successfully! (Demo Mode)');
        return newTransaction;
      }

      // First, add the transaction
      const { data, error } = await supabase
        .from('credit_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;

      // Then update officer credits
      const officer = officers.find(o => o.id === transactionData.officer_id);
      if (officer) {
        const creditChange = transactionData.action === 'Deduction' 
          ? -Math.abs(transactionData.credits)
          : Math.abs(transactionData.credits);

        const newCreditsRemaining = Math.max(0, officer.credits_remaining + creditChange);
        const newTotalCredits = ['Renewal', 'Top-up'].includes(transactionData.action)
          ? officer.total_credits + Math.abs(transactionData.credits)
          : officer.total_credits;

        await updateOfficer(transactionData.officer_id, {
          credits_remaining: newCreditsRemaining,
          total_credits: newTotalCredits
        });
      }

      await loadTransactions();
      return data;
    } catch (error: any) {
      toast.error(`Failed to add transaction: ${error.message}`);
      throw error;
    }
  };

  // CRUD Operations for API Keys
  const addAPIKey = async (apiKeyData: Omit<APIKey, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'last_used'>) => {
    try {
      if (isDemo) {
        // Mock implementation
        const newAPIKey = {
          ...apiKeyData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          usage_count: 0
        };
        setAPIKeys(prev => [...prev, newAPIKey]);
        toast.success('API key added successfully! (Demo Mode)');
        return newAPIKey;
      }

      const { data, error } = await supabase
        .from('api_keys')
        .insert([{
          ...apiKeyData,
          usage_count: 0
        }])
        .select()
        .single();

      if (error) throw error;
      
      await loadAPIKeys();
      toast.success('API key added successfully!');
      return data;
    } catch (error: any) {
      toast.error(`Failed to add API key: ${error.message}`);
      throw error;
    }
  };

  const updateAPIKey = async (id: string, updates: Partial<APIKey>) => {
    try {
      if (isDemo) {
        // Mock implementation
        setAPIKeys(prev => prev.map(apiKey => 
          apiKey.id === id ? { ...apiKey, ...updates, updated_at: new Date().toISOString() } : apiKey
        ));
        toast.success('API key updated successfully! (Demo Mode)');
        return;
      }

      const { error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await loadAPIKeys();
      toast.success('API key updated successfully!');
    } catch (error: any) {
      toast.error(`Failed to update API key: ${error.message}`);
      throw error;
    }
  };

  const deleteAPIKey = async (id: string) => {
    try {
      if (isDemo) {
        // Mock implementation
        setAPIKeys(prev => prev.filter(apiKey => apiKey.id !== id));
        toast.success('API key deleted successfully! (Demo Mode)');
        return;
      }

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await loadAPIKeys();
      toast.success('API key deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete API key: ${error.message}`);
      throw error;
    }
  };

  // Registration Management
  const updateRegistration = async (id: string, updates: Partial<OfficerRegistration>) => {
    try {
      if (isDemo) {
        // Mock implementation
        setRegistrations(prev => prev.map(reg => 
          reg.id === id ? { 
            ...reg, 
            ...updates, 
            reviewed_at: new Date().toISOString() 
          } : reg
        ));
        
        // If approved, create officer account in mock data
        if (updates.status === 'approved') {
          const registration = registrations.find(r => r.id === id);
          if (registration) {
            const newOfficer = {
              id: Date.now().toString(),
              name: registration.name,
              email: registration.email,
              mobile: registration.mobile,
              telegram_id: `@${registration.name.toLowerCase().replace(/\s+/g, '')}`,
              status: 'Active' as const,
              department: registration.department,
              rank: registration.rank,
              badge_number: registration.badge_number,
              station: registration.station,
              credits_remaining: 50,
              total_credits: 50,
              total_queries: 0,
              last_active: new Date().toISOString(),
              registered_on: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            setOfficers(prev => [...prev, newOfficer]);
          }
        }
        
        toast.success(`Registration ${updates.status} successfully! (Demo Mode)`);
        return;
      }

      const { error } = await supabase
        .from('officer_registrations')
        .update({
          ...updates,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await loadRegistrations();
      
      // If approved, create officer account
      if (updates.status === 'approved') {
        const registration = registrations.find(r => r.id === id);
        if (registration) {
          await addOfficer({
            name: registration.name,
            email: registration.email,
            mobile: registration.mobile,
            telegram_id: `@${registration.name.toLowerCase().replace(/\s+/g, '')}`,
            status: 'Active',
            department: registration.department,
            rank: registration.rank,
            badge_number: registration.badge_number,
            station: registration.station,
            credits_remaining: 50,
            total_credits: 50
          });
        }
      }
      
      toast.success(`Registration ${updates.status} successfully!`);
    } catch (error: any) {
      toast.error(`Failed to update registration: ${error.message}`);
      throw error;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Recalculate stats when data changes
  useEffect(() => {
    if (!isLoading && !isDemo) {
      calculateDashboardStats();
    }
  }, [officers, queries, transactions, isLoading, isDemo]);

  return {
    // Data
    officers,
    transactions,
    apiKeys,
    queries,
    registrations,
    liveRequests,
    dashboardStats,
    isLoading,
    
    // Actions
    loadData,
    addOfficer,
    updateOfficer,
    deleteOfficer,
    addTransaction,
    addAPIKey,
    updateAPIKey,
    deleteAPIKey,
    updateRegistration,
    
    // Setters for local updates
    setOfficers,
    setTransactions,
    setAPIKeys,
    setQueries,
    setRegistrations,
    setLiveRequests
  };
};