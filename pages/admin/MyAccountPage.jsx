import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Mail, KeyRound, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const MyAccountPage = ({ userRole }) => {
  const { currentUser } = useSupabaseAuth();
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw new Error('Failed to update email address. Please try again.');
      
      toast({ title: 'Success', description: 'Email update confirmation sent. Please check your inbox.' });
      setNewEmail('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'New passwords do not match.' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast({ variant: 'destructive', title: 'Invalid Password', description: 'Password must be at least 6 characters long.' });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error('Failed to update password. Please try again.');
      
      toast({ title: 'Success', description: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsUpdatingPassword(false);
    }
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
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">My Account</h1>
            <p className="mt-1 text-slate-500">Manage your profile credentials and security.</p>
          </div>
          <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide flex items-center shadow-sm">
            <User className="w-4 h-4 mr-2" />
            {currentUser?.email || 'Admin'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Mail className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Change Email Address</h2>
            </div>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Email</Label>
                <Input value={currentUser?.email || ''} disabled className="bg-slate-50 text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label>Current Role</Label>
                <Input value={currentUser?.adminRole?.replace('_', ' ') || 'Admin'} disabled className="bg-slate-50 text-slate-500 capitalize" />
              </div>
              <div className="space-y-2 pt-2">
                <Label>New Email Address</Label>
                <Input 
                  type="email" 
                  required 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <Button type="submit" disabled={isUpdatingEmail || !newEmail} className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-black mt-2">
                {isUpdatingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Email
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <KeyRound className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Change Password</h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  required 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  required 
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input 
                  type="password" 
                  required 
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <Button type="submit" disabled={isUpdatingPassword || !newPassword || !confirmPassword || !currentPassword} className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 mt-2">
                {isUpdatingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;