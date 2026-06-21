import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Menu, User, Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Account Components
import AccountTabs from '@/components/account/AccountTabs';
import AccountOverview from '@/components/account/AccountOverview';
import AccountOrders from '@/components/account/AccountOrders';
import AccountAddresses from '@/components/account/AccountAddresses';
import AccountProfile from '@/components/account/AccountProfile';
import AccountSecurity from '@/components/account/AccountSecurity';
import VerificationBanner from '@/components/account/VerificationBanner';

const AccountPage = () => {
  const { currentUser, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    if (!loading && !currentUser) {
      showToast("Please log in to access your account", "error");
      navigate('/login');
    }
  }, [currentUser, loading, navigate, showToast]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders': return <AccountOrders />;
      case 'addresses': return <AccountAddresses />;
      case 'profile': return <AccountProfile />;
      case 'security': return <AccountSecurity />;
      default: return <AccountOverview onNavigate={handleTabChange} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mb-4" />
            <p className="text-slate-400">Loading your account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>My Account - Occasions Gifts</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <VerificationBanner />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Tab Trigger */}
          <div className="lg:hidden mb-4">
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-[#0f1b2e] hover:bg-slate-800">
                   <Menu className="mr-2 h-4 w-4" /> Account Menu
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="bg-[#0f1a2e] border-slate-700 text-white w-[280px] p-0">
                  <div className="p-6">
                    <h2 className="text-xl font-serif font-bold text-[#d4af37] mb-6 flex items-center">
                      <User className="mr-2 h-5 w-5" /> My Account
                    </h2>
                    <AccountTabs activeTab={activeTab} onTabChange={(id) => { handleTabChange(id); }} />
                  </div>
               </SheetContent>
             </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <AccountTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 bg-[#0f1b2e] rounded-2xl border border-slate-700 p-6 md:p-8 shadow-xl">
             {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;