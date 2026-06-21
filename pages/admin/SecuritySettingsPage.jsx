import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ArrowLeft, Loader2, Shield, Lock, Activity, KeyRound, Clock } from 'lucide-react';

const SecuritySettingsPage = ({ userRole }) => {
  const [adminLogs, setAdminLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data, error } = await supabase
          .from('admin_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          setAdminLogs([]);
        } else {
          setAdminLogs(data || []);
        }
      } catch (err) {
        setErrorMsg('Unable to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
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
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Security Settings</h1>
            <p className="mt-1 text-slate-500">Monitor system security and administrator activities.</p>
          </div>
          <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center shadow-sm">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">2FA Status</h3>
              <p className="text-slate-500 text-sm mt-1 mb-2">Two-factor authentication configuration</p>
              <span className="inline-block bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-md text-sm font-medium">
                Not configured
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Login Attempts</h3>
              <p className="text-slate-500 text-sm mt-1 mb-2">Monitor recent authentication activity</p>
              <span className="inline-block bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-md text-sm font-medium">
                No attempts logged
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Login Logs</h2>
            </div>
            <div className="p-12 text-center flex-grow flex items-center justify-center">
              <p className="text-slate-500">No logs available</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
              <KeyRound className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Access Logs</h2>
            </div>
            <div className="p-6 flex-grow">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
                </div>
              ) : adminLogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500">No logs available</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {adminLogs.map(log => (
                    <li key={log.id} className="text-sm">
                      <span className="font-medium text-slate-900 dark:text-white">{log.action}</span> - {log.resource_type}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecuritySettingsPage;