import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ArrowLeft, Loader2, Users, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const ManageAdminsPage = ({ userRole }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id, user_id, role, created_at')
          .order('created_at', { ascending: false });

        if (adminError) {
          throw new Error('Unable to load data');
        }

        let profilesData = [];
        try {
          const { data: profiles } = await supabase.from('profiles').select('id, email');
          if (profiles) profilesData = profiles;
        } catch (e) {
          // Ignore profile fetch issues
        }

        const merged = adminData.map(admin => {
          const profile = profilesData.find(p => p.id === admin.user_id);
          return {
            ...admin,
            email: profile?.email || 'Unknown',
            status: 'Active'
          };
        });

        setAdmins(merged);
      } catch (err) {
        setErrorMsg('Unable to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1a2e]">
      <AdminSidebar userRole={userRole} onLogout={handleLogout} />
      <div className="ml-64 p-8">
        <Link 
          to="/admin/super" 
          className="inline-flex items-center text-slate-500 hover:text-[#d4af37] mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Super Admin
        </Link>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Manage Admins</h1>
            <p className="mt-1 text-slate-500">View and review administrator accounts across the system.</p>
          </div>
          <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center shadow-sm">
            <Users className="w-4 h-4 mr-2" />
            Admin List
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {errorMsg ? (
            <div className="p-12 text-center flex flex-col items-center">
              <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Error</h3>
              <p className="text-slate-500">{errorMsg}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" />
                      </td>
                    </tr>
                  ) : admins.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                        No admin users available
                      </td>
                    </tr>
                  ) : (
                    admins.map(admin => (
                      <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {admin.created_at ? format(new Date(admin.created_at), 'MMM d, yyyy HH:mm') : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdminsPage;