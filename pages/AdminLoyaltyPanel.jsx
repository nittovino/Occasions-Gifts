import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Search, Crown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import AdminLayout from '@/layouts/AdminLayout';

const AdminLoyaltyPanel = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Adjust Points Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loyalty_members')
        .select(`
          *,
          profiles:user_id (email, name)
        `)
        .order('points_balance', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      toast({ title: "Error loading members", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustPoints = async () => {
    if (!selectedMember || !adjustAmount) return;
    const amount = parseInt(adjustAmount);
    
    try {
      // Direct update for admin
      const newBalance = selectedMember.points_balance + amount;
      const { error: updateErr } = await supabase
        .from('loyalty_members')
        .update({ points_balance: newBalance })
        .eq('id', selectedMember.id);
        
      if (updateErr) throw updateErr;

      // Log history
      await supabase.from('points_history').insert([{
        user_id: selectedMember.user_id, // Fixed member_id to user_id to match typical schema
        points: amount,
        action_type: 'admin_adjustment',
        description: adjustReason || 'Admin adjustment'
      }]);

      toast({ title: "Points adjusted successfully" });
      setIsAdjustModalOpen(false);
      fetchMembers(); // refresh
    } catch (error) {
      toast({ title: "Failed to adjust points", description: error.message, variant: "destructive" });
    }
  };

  const filteredMembers = members.filter(m => 
    m.membership_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="text-white w-full">
        <Helmet><title>Loyalty Admin - Occasions Gifts</title></Helmet>
        
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-serif font-bold text-[#d4af37] flex items-center">
              <Crown className="mr-3 h-8 w-8" /> Loyalty Management
            </h1>
          </div>

          <div className="bg-[#15233e] rounded-xl border border-slate-700 p-6 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search by ID or Email..." 
                    className="pl-10 bg-[#0f1b2e] border-slate-700 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
             </div>

             <div className="overflow-x-auto rounded-lg border border-slate-700">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-slate-400 uppercase bg-[#0f1b2e]">
                   <tr>
                     <th className="px-6 py-4">Member</th>
                     <th className="px-6 py-4">ID</th>
                     <th className="px-6 py-4">Tier</th>
                     <th className="px-6 py-4">Points</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {loading ? (
                     <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
                   ) : filteredMembers.map(m => (
                     <tr key={m.id} className="border-b border-slate-800/50 hover:bg-[#1a2a4a]">
                       <td className="px-6 py-4 font-medium">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                             <User className="w-4 h-4" />
                           </div>
                           <span>{m.profiles?.email || 'Unknown'}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 font-mono text-slate-300">{m.membership_id}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${
                           m.current_tier === 'Platinum' ? 'bg-slate-200 text-slate-800' :
                           m.current_tier === 'Gold' ? 'bg-amber-500 text-black' :
                           'bg-slate-700 text-white'
                         }`}>{m.current_tier || 'Silver'}</span>
                       </td>
                       <td className="px-6 py-4 font-mono font-bold text-[#d4af37]">{m.points_balance}</td>
                       <td className="px-6 py-4 text-right">
                         <Button 
                           variant="outline" 
                           size="sm"
                           className="border-slate-600 text-white hover:bg-slate-700"
                           onClick={() => { setSelectedMember(m); setIsAdjustModalOpen(true); }}
                         >
                           Adjust Points
                         </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Adjust Points Modal */}
        <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
          <DialogContent className="bg-[#1a2a4a] text-white border-slate-700">
            <DialogHeader>
              <DialogTitle>Adjust Points for {selectedMember?.profiles?.email}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Amount (Use negative for deduction)</label>
                <Input 
                  type="number" 
                  value={adjustAmount} 
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g. 500 or -200"
                  className="bg-[#0f1b2e] border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Reason / Description</label>
                <Input 
                  value={adjustReason} 
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Customer support appeasement"
                  className="bg-[#0f1b2e] border-slate-700 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)} className="border-slate-600 text-white hover:bg-slate-700">Cancel</Button>
              <Button className="bg-[#d4af37] text-black hover:bg-[#c19a2f]" onClick={handleAdjustPoints}>Save Adjustment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminLoyaltyPanel;