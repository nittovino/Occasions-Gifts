import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { validateEmail } from '@/lib/validators';
import { supabase } from '@/lib/customSupabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useSupabaseAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://occasions-gifts.com/auth/callback",
          skipBrowserRedirect: false
        }
      });
      
      if (error) {
        console.error('OAuth error during Google Sign-In:', error);
        showToast(error.message, "error", 5000, "Google Sign-In Failed");
      }
    } catch (error) {
      console.error('Unexpected error during Google Sign-In:', error);
      showToast("An unexpected error occurred during Google authentication.", "error", 5000, "Authentication Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      showToast("Please enter a valid email address.", "error", 5000, "Invalid Email");
      return;
    }

    setLoading(true);

    try {
      const { data } = await login(email, password);
      
      if (data?.user) {
        const userId = data.user.id;
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (!existingProfile) {
          const { error: profileErr } = await supabase.from('profiles').insert({
            id: userId,
            email: data.user.email,
            role: 'customer'
          });
          if (profileErr && profileErr.code !== '23505') {
            console.error("Profile fallback creation error:", profileErr);
          }
        }
      }

      showToast(t('loginSuccess'), "success", 3000, t('welcomeBack'));
      navigate('/');
    } catch (error) {
      showToast(error.message, "error", 5000, t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Helmet>
        <title>{t('login')} - Occasions Gifts</title>
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-white mb-2">{t('welcomeBack')}</h1>
            <p className="text-slate-400">{t('loginToContinue')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-8 rounded-lg border border-slate-800">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">{t('email')}</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">{t('password')}</label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
              {loading ? t('loggingIn') : t('login')}
            </Button>

            <Button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="w-full bg-white hover:bg-gray-100 text-slate-900 border border-slate-200"
            >
              Continue with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-400">
                {t('noAccount')} <Link to="/signup" className="text-amber-500 hover:text-amber-400">{t('signup')}</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;