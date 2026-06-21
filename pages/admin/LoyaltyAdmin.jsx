import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LoyaltyMembers from '@/components/admin/LoyaltyMembers';
import LoyaltyTiers from '@/components/admin/LoyaltyTiers';
import LoyaltyCampaigns from '@/components/admin/LoyaltyCampaigns';
import Rewards from '@/components/admin/Rewards';
import LoyaltyAnalytics from '@/components/admin/LoyaltyAnalytics';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Award } from 'lucide-react';

const LoyaltyAdmin = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1a2e]">
      <AdminSidebar userRole={userRole} onLogout={handleLogout} />
      
      <div className="ml-64 p-8">
        <div className="flex flex-col mb-8 gap-4">
          {userRole === 'super_admin' && (
            <div className="self-start">
              <Button variant="ghost" className="text-slate-500 pl-0 hover:bg-transparent hover:text-[#d4af37]" onClick={() => navigate('/admin/super')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Super Admin
              </Button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Loyalty Program Admin</h1>
              <p className="text-slate-500 mt-1">Manage members, tiers, campaigns, and rewards</p>
            </div>
            <span className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase flex items-center shadow-sm">
              <Award className="w-4 h-4 mr-2" />
              {userRole.replace('_', ' ')}
            </span>
          </div>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-slate-200 dark:bg-slate-800 w-full justify-start overflow-x-auto h-auto py-2">
            <TabsTrigger value="members" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-slate-900">Members</TabsTrigger>
            <TabsTrigger value="tiers" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-slate-900">Tiers</TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-slate-900">Campaigns</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-slate-900">Rewards</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-slate-900">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="members"><LoyaltyMembers /></TabsContent>
            <TabsContent value="tiers"><LoyaltyTiers /></TabsContent>
            <TabsContent value="campaigns"><LoyaltyCampaigns /></TabsContent>
            <TabsContent value="rewards"><Rewards /></TabsContent>
            <TabsContent value="analytics"><LoyaltyAnalytics /></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LoyaltyAdmin;