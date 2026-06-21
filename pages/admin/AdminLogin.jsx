import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Could not retrieve user details.");

      console.log("AUTH USER ID:", user?.id);
      console.log("AUTH EMAIL:", user?.email);

      // Verify admin role
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('user_id, role')
        .eq('user_id', user.id)
        .single();

      if (error || !adminUser) {
        await supabase.auth.signOut();
        toast({ variant: 'destructive', title: 'Access Denied', description: 'You do not have administrative privileges' });
        setLoading(false);
        return;
      }

      toast({ title: 'Login Successful', description: `Welcome back, ${adminUser.role.replace('_', ' ')}` });

      const from = location.state?.from || null;
      let redirectPath = '/account';

      if (from) {
        redirectPath = from;
      } else {
        if (adminUser.role === 'super_admin') redirectPath = '/admin/super';
        else if (adminUser.role === 'loyalty_manager') redirectPath = '/admin/loyalty';
        else if (adminUser.role === 'b2b_manager') redirectPath = '/admin/b2b';
        else if (adminUser.role === 'affiliate_manager') redirectPath = '/admin/affiliate';
        else if (adminUser.role === 'content_manager') redirectPath = '/admin/content';
      }

      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error("UNEXPECTED ERROR", err);
      toast({ variant: 'destructive', title: 'Login Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2a4a]">
      <div className="bg-slate-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-[#d4af37]">Occasions Admin</h1>
          <p className="text-slate-400 mt-2">Sign in to access admin portals</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <Input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="bg-slate-800 border-slate-700 text-white focus-visible:ring-[#d4af37]" 
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <Input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="bg-slate-800 border-slate-700 text-white focus-visible:ring-[#d4af37]" 
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#d4af37] text-slate-900 hover:bg-[#c19a2f] font-bold text-base h-11 mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;