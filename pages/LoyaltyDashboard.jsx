import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from '@/hooks/useTranslation';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, Crown, ChevronRight, Award, History, Info, Star, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembershipCard from '@/components/MembershipCard';
import AchievementBadges from '@/components/AchievementBadges';
import RedemptionWidget from '@/components/RedemptionWidget';

const LoyaltyDashboard = () => {
  const { t } = useTranslation();
  const { currentUser, loading: authLoading } = useSupabaseAuth();
  const { memberData, pointsHistory, redemptions, rewards, achievements, loading, error, redeem, joinLoyalty } = useLoyalty();
  
  const [activeTab, setActiveTab] = useState("overview");

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#1a2a4a] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
             <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mx-auto mb-4" />
             <p className="text-slate-400 text-sm">Loading your rewards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !memberData) {
    return (
      <div className="min-h-screen bg-[#1a2a4a] flex flex-col text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
           <div className="max-w-md text-center bg-[#0f1b2e] p-8 rounded-2xl border border-slate-700">
             <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
             <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
             <p className="text-slate-400 mb-6">{error}</p>
             <Button onClick={() => window.location.reload()} className="bg-[#d4af37] text-black">Try Again</Button>
           </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Not a member state (requires explicit activation)
  if (!memberData && currentUser) {
    return (
      <div className="min-h-screen bg-[#1a2a4a] text-white flex flex-col">
        <Helmet><title>Join Loyalty - Occasions Gifts</title></Helmet>
        <Header />
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
          <div className="max-w-md w-full bg-[#15233e] rounded-3xl p-8 border border-slate-700 text-center shadow-2xl relative z-10">
            <Crown className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-4">Activate Your Membership</h2>
            <p className="text-slate-400 mb-8">Join the Occasions Loyalty Club to start earning points and unlocking exclusive rewards. Activation is required.</p>
            <Button onClick={joinLoyalty} className="w-full bg-[#d4af37] text-black hover:bg-[#c19a2f] h-12 text-lg font-bold">
              Join For Free
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
     return (
        <div className="min-h-screen bg-[#1a2a4a] text-white flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center text-slate-400 p-4">
             <p>Please log in to view your Loyalty Dashboard.</p>
          </div>
          <Footer />
        </div>
     );
  }

  const nextTierInfo = () => {
    if (!memberData) return null;
    const pts = memberData.lifetime_points || 0;
    if (pts < 3000) return { name: 'Gold', needed: 3000 - pts, progress: (pts / 3000) * 100 };
    if (pts < 10000) return { name: 'Platinum', needed: 10000 - pts, progress: ((pts - 3000) / 7000) * 100 };
    return { name: 'Max Tier Reached', needed: 0, progress: 100 };
  };

  const nextTier = nextTierInfo();

  return (
    <div className="min-h-screen bg-[#1a2a4a] text-white">
      <Helmet><title>Loyalty Dashboard - Occasions Gifts</title></Helmet>
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              {t('loyalty.dashboard.welcome') || "Welcome"}, {currentUser?.full_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0]}
            </h1>
            <p className="text-slate-400 flex items-center gap-2">
              Member since {memberData?.created_at ? new Date(memberData.created_at).getFullYear() : new Date().getFullYear()}
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              {memberData?.current_tier || 'Silver'} Tier
            </p>
          </div>
          
          <div className="bg-[#15233e] px-6 py-3 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-lg">
             <div>
               <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available Points</p>
               <p className="text-2xl font-bold text-[#d4af37] font-mono">{memberData?.points_balance || 0}</p>
             </div>
             <div className="w-px h-10 bg-slate-700"></div>
             <Button variant="ghost" className="text-white hover:text-[#d4af37]" onClick={() => setActiveTab('rewards')}>
               Redeem <ChevronRight className="w-4 h-4 ml-1" />
             </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#15233e] border border-slate-800 p-1 mb-8 w-full md:w-auto overflow-x-auto flex-nowrap justify-start">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black min-w-[100px]">Overview</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black min-w-[100px]">Rewards</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black min-w-[100px]">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            {/* Top Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Digital Card Area */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                 <h3 className="text-lg font-serif font-bold text-white mb-4 pl-2">Your Digital Card</h3>
                 <MembershipCard member={memberData} user={currentUser} />
              </div>

              {/* Status & Progress Area */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Tier Progress Card */}
                <div className="bg-[#15233e] rounded-3xl p-6 md:p-8 border border-slate-700 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-end mb-6 relative z-10">
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-1">Current Status</p>
                      <h3 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                        {memberData?.current_tier || 'Silver'} Member
                        {memberData?.current_tier === 'Platinum' && <Crown className="w-6 h-6 text-slate-300" />}
                        {memberData?.current_tier === 'Gold' && <Crown className="w-6 h-6 text-amber-500" />}
                        {(!memberData?.current_tier || memberData?.current_tier === 'Silver') && <Star className="w-6 h-6 text-slate-400" />}
                      </h3>
                    </div>
                    <div className="text-right">
                       <p className="text-slate-400 text-sm font-medium mb-1">Lifetime Points</p>
                       <p className="text-xl font-bold font-mono">{memberData?.lifetime_points || 0}</p>
                    </div>
                  </div>

                  {nextTier && nextTier.name !== 'Max Tier Reached' && (
                    <div className="relative z-10 bg-[#0f1b2e] p-5 rounded-2xl border border-slate-800">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-300">Progress to <span className="font-bold text-[#d4af37]">{nextTier.name}</span></span>
                        <span className="text-slate-400">{nextTier.needed} pts needed</span>
                      </div>
                      <Progress value={nextTier.progress} className="h-2.5 bg-slate-800" indicatorClassName="bg-gradient-to-r from-[#d4af37] to-[#F2C94C]" />
                      <p className="text-xs text-slate-500 mt-3 flex items-center">
                        <Info className="w-3 h-3 mr-1"/> Earn {nextTier.name === 'Gold' ? '1.5x' : '2x'} points and free shipping at {nextTier.name}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#15233e] rounded-2xl p-5 border border-slate-700 shadow-md">
                     <p className="text-sm text-slate-400 mb-1">Points Multiplier</p>
                     <p className="text-2xl font-bold text-white">
                        {memberData?.current_tier === 'Platinum' ? '2.0x' : memberData?.current_tier === 'Gold' ? '1.5x' : '1.0x'}
                     </p>
                   </div>
                   <div className="bg-[#15233e] rounded-2xl p-5 border border-slate-700 shadow-md">
                     <p className="text-sm text-slate-400 mb-1">Total Savings</p>
                     <p className="text-2xl font-bold text-green-400">
                        €{redemptions?.reduce((acc, curr) => acc + (curr.rewards?.value_amount || 0), 0) || 0}
                     </p>
                   </div>
                </div>

              </div>
            </div>

            {/* Achievements Section */}
            <div className="mt-12">
              <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-[#d4af37]" />
                {t('loyalty.dashboard.achievements') || "Achievements & Badges"}
              </h3>
              <AchievementBadges achievements={achievements || []} />
            </div>

          </TabsContent>

          <TabsContent value="rewards" className="animate-in fade-in duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-white mb-2">Redeem Points</h2>
              <p className="text-slate-400">Choose a reward to unlock with your available points.</p>
            </div>
            
            <RedemptionWidget 
              rewards={rewards || []} 
              pointsBalance={memberData?.points_balance || 0} 
              onRedeem={redeem}
              redemptions={redemptions || []}
            />
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in duration-500">
            <div className="bg-[#15233e] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-serif font-bold text-white flex items-center">
                  <History className="w-5 h-5 mr-2" /> Points History
                </h3>
              </div>
              
              {(!pointsHistory || pointsHistory.length === 0) ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <Star className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">No activity yet</p>
                  <p className="text-sm">Start shopping or complete actions to earn points!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-[#0f1b2e]">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointsHistory.map((item) => (
                        <tr key={item.id} className="border-b border-slate-800/50 hover:bg-[#1a2a4a] transition-colors">
                          <td className="px-6 py-4 text-slate-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-white capitalize">
                            {item.action_type.replace(/_/g, ' ')}
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            {item.description}
                          </td>
                          <td className={`px-6 py-4 text-right font-bold font-mono ${item.points > 0 ? 'text-green-400' : 'text-slate-300'}`}>
                            {item.points > 0 ? '+' : ''}{item.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default LoyaltyDashboard;