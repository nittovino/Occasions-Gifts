
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { validateEmail } from '@/lib/validators';
import { supabase } from '@/lib/customSupabaseClient';
import { generateMembershipId } from '@/lib/helpers';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://occasions-gifts.com/auth/callback",
          skipBrowserRedirect: false
        }
      });
      
      if (error) {
        console.error('OAuth error during Google Sign-Up:', error);
        showToast(error.message, "error", 5000, "Google Sign-Up Failed");
      }
    } catch (error) {
      console.error('Unexpected error during Google Sign-Up:', error);
      showToast("An unexpected error occurred during Google authentication.", "error", 5000, "Authentication Error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      showToast("Please enter a valid email address.", "error", 5000, "Invalid Email");
      return;
    }

    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error", 5000, "Weak Password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match.", "error", 5000, "Password Error");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name }
        }
      });
      
      if (error) {
        showToast(error.message, "error", 5000, "Signup Failed");
        setIsSubmitting(false);
        return;
      }

      if (data?.user) {
        try {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();

          if (!existingProfile) {
            const { error: profileErr } = await supabase.from('profiles').insert({
              id: data.user.id,
              email: data.user.email,
              role: 'customer'
            });
            if (profileErr && profileErr.code !== '23505') console.error("Profile creation error:", profileErr);
          }

          const { data: existingLoyalty } = await supabase
            .from('loyalty_members')
            .select('id')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (!existingLoyalty) {
            const { error: loyaltyErr } = await supabase.from('loyalty_members').insert({
              user_id: data.user.id,
              membership_id: generateMembershipId(),
              current_tier: 'Silver',
              points_balance: 200,
              lifetime_points: 200
            });
            if (loyaltyErr && loyaltyErr.code !== '23505') console.error("Loyalty creation error:", loyaltyErr);
          }

          showToast("Account created successfully! Welcome to Occasions.", "success", 5000);
        } catch (profileCreationError) {
          console.error("Error setting up default profiles:", profileCreationError);
        }
      }
      
      navigate('/');
    } catch (error) {
      console.error(error);
      showToast("An unexpected error occurred during signup", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('signup') || 'Sign Up'} - Occasions Gifts</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12 relative w-full">
        <div className="hidden md:block absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none z-0"></div>
        <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none z-0"></div>
        
        <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10 mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#d4af37] mb-2">Join Occasions</h1>
            <p className="text-sm sm:text-base text-slate-300">Start sending the perfect gifts today.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 bg-[#0f1b2e] p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-700 shadow-2xl w-full">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">Full Name</label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="bg-[#1a2a4a] border-slate-600 text-white placeholder-slate-400 focus:ring-[#d4af37] focus:border-[#d4af37] w-full text-base sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="bg-[#1a2a4a] border-slate-600 text-white placeholder-slate-400 focus:ring-[#d4af37] focus:border-[#d4af37] w-full text-base sm:text-sm"
                placeholder="Email address"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="bg-[#1a2a4a] border-slate-600 text-white placeholder-slate-400 focus:ring-[#d4af37] focus:border-[#d4af37] w-full text-base sm:text-sm"
                placeholder="Password"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">Confirm Password</label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
                className="bg-[#1a2a4a] border-slate-600 text-white placeholder-slate-400 focus:ring-[#d4af37] focus:border-[#d4af37] w-full text-base sm:text-sm"
                placeholder="Confirm password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-black font-bold h-12 text-base sm:text-lg rounded-xl shadow-lg transition-all" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <Button 
              type="button" 
              onClick={handleGoogleSignup} 
              className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold h-12 text-base sm:text-lg rounded-xl shadow-lg transition-all"
            >
              Continue with Google
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-slate-400">
                Already have an account? <Link to="/login" className="text-[#d4af37] hover:underline font-medium">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignupPage;
