import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!currentUser) {
      navigate('/admin/login', { replace: true });
      return;
    }

    const role = currentUser.adminRole;

    if (role === 'super_admin') {
      navigate('/admin/super', { replace: true });
    } else if (role === 'loyalty_manager') {
      navigate('/admin/loyalty', { replace: true });
    } else if (role === 'b2b_manager') {
      navigate('/admin/b2b', { replace: true });
    } else if (role === 'affiliate_manager') {
      navigate('/admin/affiliate', { replace: true });
    } else if (role === 'content_manager') {
      navigate('/admin/content', { replace: true });
    } else {
      navigate('/account', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2a4a] text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
      <span className="ml-3 font-medium">Redirecting to dashboard...</span>
    </div>
  );
};

export default AdminDashboard;