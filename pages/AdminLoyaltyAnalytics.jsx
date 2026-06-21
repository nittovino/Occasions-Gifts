import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Users, Star, Gift, TrendingUp, Download } from 'lucide-react';

const AdminLoyaltyAnalytics = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPointsIssued: 0,
    totalRedemptions: 0,
    tierBreakdown: { Silver: 0, Gold: 0, Platinum: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Quick high-level aggregations
        const { count: totalMembers } = await supabase.from('loyalty_members').select('*', { count: 'exact', head: true });
        
        const { data: tiers } = await supabase.from('loyalty_members').select('tier');
        const breakdown = { Silver: 0, Gold: 0, Platinum: 0 };
        tiers?.forEach(t => { if(breakdown[t.tier] !== undefined) breakdown[t.tier]++; });

        const { data: redemptions } = await supabase.from('redemptions').select('points_spent');
        const totalRedemptions = redemptions?.reduce((sum, r) => sum + r.points_spent, 0) || 0;

        setStats({
          totalMembers: totalMembers || 0,
          tierBreakdown: breakdown,
          totalRedemptions
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading Analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a2a4a] text-white p-6">
      <Helmet><title>Loyalty Analytics - Occasions</title></Helmet>
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#d4af37] flex items-center">
            <BarChart className="mr-3 h-8 w-8" /> Loyalty Analytics
          </h1>
          <button className="flex items-center text-slate-300 hover:text-white px-4 py-2 bg-[#15233e] rounded-lg border border-slate-700">
            <Download className="w-4 h-4 mr-2"/> Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#15233e] p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg"><Users className="w-6 h-6 text-blue-400" /></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalMembers}</h3>
            <p className="text-slate-400 text-sm">Total Members</p>
          </div>
          
          <div className="bg-[#15233e] p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg"><Gift className="w-6 h-6 text-purple-400" /></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalRedemptions.toLocaleString()}</h3>
            <p className="text-slate-400 text-sm">Points Redeemed</p>
          </div>

          <div className="bg-[#15233e] p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-500/10 rounded-lg"><Star className="w-6 h-6 text-amber-400" /></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.tierBreakdown.Gold}</h3>
            <p className="text-slate-400 text-sm">Gold Members</p>
          </div>

          <div className="bg-[#15233e] p-6 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-500/10 rounded-lg"><TrendingUp className="w-6 h-6 text-slate-300" /></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.tierBreakdown.Platinum}</h3>
            <p className="text-slate-400 text-sm">Platinum Members</p>
          </div>
        </div>

        {/* Future chart placeholders */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
           <div className="bg-[#15233e] p-6 rounded-xl border border-slate-700 h-80 flex items-center justify-center">
             <p className="text-slate-500">Tier Distribution Chart (Placeholder)</p>
           </div>
           <div className="bg-[#15233e] p-6 rounded-xl border border-slate-700 h-80 flex items-center justify-center">
             <p className="text-slate-500">Points Issuance vs Redemption (Placeholder)</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLoyaltyAnalytics;