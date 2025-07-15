import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Edit2, Trash2, UserCheck, UserX, X } from 'lucide-react';
import { StatusBadge } from '../components/UI/StatusBadge';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useTheme } from '../contexts/ThemeContext';
import { Officer } from '../lib/supabase';
import toast from 'react-hot-toast';

export const Officers: React.FC = () => {
  const { officers, isLoading, addOfficer, updateOfficer, deleteOfficer } = useSupabaseData();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    telegram_id: '',
    department: '',
    rank: '',
    badge_number: '',
    station: '',
    status: 'Active' as 'Active' | 'Suspended',
    total_credits: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.mobile.includes(searchTerm) ||
                         officer.telegram_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || officer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddOfficer = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      telegram_id: '',
      department: '',
      rank: '',
      badge_number: '',
      station: '',
      status: 'Active',
      total_credits: 50
    });
    setEditingOfficer(null);
    setShowAddModal(true);
  };

  const handleEditOfficer = (officer: Officer) => {
    setFormData({
      name: officer.name,
      email: officer.email,
      mobile: officer.mobile,
      telegram_id: officer.telegram_id || '',
      department: officer.department || '',
      rank: officer.rank || '',
      badge_number: officer.badge_number || '',
      station: officer.station || '',
      status: officer.status,
      total_credits: officer.total_credits
    });
    setEditingOfficer(officer);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingOfficer) {
        await updateOfficer(editingOfficer.id, {
          ...formData,
          credits_remaining: formData.total_credits // Reset credits when editing
        });
      } else {
        await addOfficer({
          ...formData,
          credits_remaining: formData.total_credits,
        });
      }

      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        telegram_id: '',
        department: '',
        rank: '',
        badge_number: '',
        station: '',
        status: 'Active',
        total_credits: 50
      });
    } catch (error) {
      console.error('Error saving officer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOfficer = (officer: Officer) => {
    if (window.confirm(`Are you sure you want to delete ${officer.name}?`)) {
      deleteOfficer(officer.id);
    }
  };

  const handleToggleStatus = (officer: Officer) => {
    const newStatus = officer.status === 'Active' ? 'Suspended' : 'Active';
    
    updateOfficer(officer.id, { status: newStatus })
      .then(() => {
        toast.success(`Officer ${newStatus.toLowerCase()} successfully`);
      })
      .catch((error) => {
        console.error('Error updating officer status:', error);
        toast.error('Failed to update officer status');
      });
  };
}