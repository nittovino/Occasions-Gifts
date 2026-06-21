import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { generateMembershipId } from '@/lib/helpers';

export function useLoyalty() {
  const { currentUser } = useSupabaseAuth();
  const [memberData, setMemberData] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoyaltyData = useCallback(async () => {
    if (!currentUser) {
      setMemberData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Member Profile gracefully
      const { data: member, error: memberErr } = await supabase
        .from('loyalty_members')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (memberErr && memberErr.code !== 'PGRST116') {
         throw memberErr;
      }
      
      setMemberData(member || null);

      if (member) {
        // 2. Fetch Points History
        const { data: history } = await supabase
          .from('points_history')
          .select('*')
          .eq('user_id', member.user_id)
          .order('created_at', { ascending: false })
          .limit(20);
        setPointsHistory(history || []);

        // 3. Fetch Rewards
        const { data: rew } = await supabase
          .from('rewards')
          .select('*')
          .eq('is_active', true)
          .order('points_cost', { ascending: true });
        setRewards(rew || []);

        // 4. Fetch Redemptions
        const { data: reds } = await supabase
          .from('redemptions')
          .select('*, rewards(name, value_amount)')
          .eq('user_id', member.user_id)
          .order('created_at', { ascending: false });
        setRedemptions(reds || []);

        // 5. Fetch Achievements (all and cross-reference with member)
        const { data: allAchs } = await supabase.from('achievements').select('*');
        const { data: myAchs } = await supabase.from('achievements').select('badge_name').eq('user_id', member.user_id);
        
        const myAchIds = new Set(myAchs?.map(ma => ma.badge_name) || []);
        const mappedAchs = (allAchs || []).map(ach => ({
           ...ach,
           unlocked: myAchIds.has(ach.badge_name)
        }));
        setAchievements(mappedAchs);
      } else {
        // Bring active rewards to show public facing
        const { data: rew } = await supabase
          .from('rewards')
          .select('*')
          .eq('is_active', true)
          .order('points_cost', { ascending: true });
        setRewards(rew || []);
      }
    } catch (err) {
      console.error("Error fetching loyalty data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchLoyaltyData();
  }, [fetchLoyaltyData]);

  const joinLoyalty = async () => {
    if (!currentUser) throw new Error("Must be logged in");
    try {
      setLoading(true);
      const { data: existing } = await supabase
        .from('loyalty_members')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (!existing) {
        const { error: insertErr } = await supabase.from('loyalty_members').insert({
            user_id: currentUser.id,
            membership_id: generateMembershipId(),
            current_tier: 'Silver',
            points_balance: 200,
            lifetime_points: 200
        });
        if (insertErr && insertErr.code !== '23505') throw insertErr;
      }
      await fetchLoyaltyData();
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  const redeem = async (rewardId, pointsCost) => {
    if (!memberData) throw new Error("Not a member");
    try {
      const { error } = await supabase.from('redemptions').insert({
        user_id: currentUser.id,
        reward_id: rewardId,
        points_cost: pointsCost,
        status: 'completed',
        redemption_code: `RDM-${Math.floor(Math.random() * 10000)}`
      });
      if (error) throw error;
      
      await supabase.from('loyalty_members').update({
        points_balance: memberData.points_balance - pointsCost
      }).eq('id', memberData.id);
      
      await fetchLoyaltyData();
    } catch(e) {
      console.error(e);
      throw e;
    }
  };

  return {
    memberData,
    pointsHistory,
    redemptions,
    rewards,
    achievements,
    loading,
    error,
    joinLoyalty,
    redeem,
    refresh: fetchLoyaltyData
  };
}