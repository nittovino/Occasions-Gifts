import { supabase } from '@/lib/customSupabaseClient';

export const LoyaltyService = {
  // Core config
  TIERS: {
    Silver: { name: 'Silver', minPoints: 0, multiplier: 1 },
    Gold: { name: 'Gold', minPoints: 3000, multiplier: 1.5 },
    Platinum: { name: 'Platinum', minPoints: 10000, multiplier: 2 }
  },

  calculatePointsEarned(orderAmount, memberTier = 'Silver') {
    const basePoints = Math.floor(Number(orderAmount) * 10);
    const multiplier = this.TIERS[memberTier]?.multiplier || 1;
    return Math.floor(basePoints * multiplier);
  },

  generateMembershipId() {
    return `OGL-${Math.floor(100000 + Math.random() * 900000)}`;
  },

  async enrollMember(userId) {
    const { data: member, error } = await supabase
      .from('loyalty_members')
      .insert([
        {
          user_id: userId,
          membership_id: this.generateMembershipId(),
          tier: 'Silver',
          points_balance: 200, // Sign up bonus
          lifetime_points: 200
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Log the signup bonus
    await this.logPoints(member.id, 200, 'signup', 'Welcome Bonus');
    return member;
  },

  async awardPoints(memberId, points, actionType, description, orderId = null) {
    if (points <= 0) return null;

    // 1. Update Member Balance
    const { data: member, error: memberError } = await supabase
      .rpc('increment_points', { m_id: memberId, p_amount: points }); 
      // If RPC doesn't exist, we do it in two steps (read then update) for pure frontend
      // Given we didn't create RPC in DB, we'll do JS level increment:
      
    const { data: currentMember, error: fetchErr } = await supabase
      .from('loyalty_members')
      .select('points_balance, lifetime_points')
      .eq('id', memberId)
      .single();

    if (fetchErr) throw fetchErr;

    const newBalance = (currentMember.points_balance || 0) + points;
    const newLifetime = (currentMember.lifetime_points || 0) + points;

    const { error: updateErr } = await supabase
      .from('loyalty_members')
      .update({ 
        points_balance: newBalance,
        lifetime_points: newLifetime
      })
      .eq('id', memberId);

    if (updateErr) throw updateErr;

    // 2. Log History
    await this.logPoints(memberId, points, actionType, description, orderId);

    // 3. Check for tier upgrades and achievements
    await this.updateMemberTier(memberId, newLifetime);
    await this.checkAchievements(memberId);

    return { points_balance: newBalance, lifetime_points: newLifetime };
  },

  async logPoints(memberId, points, actionType, description, orderId = null) {
    // Points expire in 12 months
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await supabase
      .from('points_history')
      .insert([{
        member_id: memberId,
        points: points,
        action_type: actionType,
        description: description,
        order_id: orderId,
        expires_at: expiresAt.toISOString()
      }]);
  },

  async updateMemberTier(memberId, lifetimePoints) {
    let newTier = 'Silver';
    if (lifetimePoints >= this.TIERS.Platinum.minPoints) newTier = 'Platinum';
    else if (lifetimePoints >= this.TIERS.Gold.minPoints) newTier = 'Gold';

    const { data: member } = await supabase
      .from('loyalty_members')
      .select('tier')
      .eq('id', memberId)
      .single();

    if (member && member.tier !== newTier) {
      await supabase
        .from('loyalty_members')
        .update({ tier: newTier, tier_upgraded_at: new Date().toISOString() })
        .eq('id', memberId);
    }
    return newTier;
  },

  async checkFamilyBonus(memberId, recipientAddress) {
    // Basic logic: increment gift count for address. If 5, award +1500 points.
    const { data: record } = await supabase
      .from('family_bonus_tracking')
      .select('*')
      .eq('member_id', memberId)
      .eq('recipient_address', recipientAddress)
      .single();

    if (!record) {
      await supabase.from('family_bonus_tracking').insert([{
        member_id: memberId,
        recipient_address: recipientAddress,
        gift_count: 1
      }]);
      return false;
    }

    const newCount = record.gift_count + 1;
    const shouldAward = newCount >= 5 && !record.bonus_awarded;

    await supabase.from('family_bonus_tracking').update({
      gift_count: newCount,
      bonus_awarded: shouldAward ? true : record.bonus_awarded,
      bonus_awarded_at: shouldAward ? new Date().toISOString() : record.bonus_awarded_at,
      updated_at: new Date().toISOString()
    }).eq('id', record.id);

    if (shouldAward) {
      await this.awardPoints(memberId, 1500, 'family_bonus', 'Family Bonus Unlocked!');
    }

    return shouldAward;
  },

  async redeemReward(memberId, rewardId) {
    // 1. Fetch member and reward
    const { data: member } = await supabase.from('loyalty_members').select('*').eq('id', memberId).single();
    const { data: reward } = await supabase.from('rewards').select('*').eq('id', rewardId).single();

    if (!member || !reward) throw new Error("Invalid request");
    if (member.points_balance < reward.points_required) throw new Error("Insufficient points");

    // 2. Deduct points
    const newBalance = member.points_balance - reward.points_required;
    const { error: updateErr } = await supabase
      .from('loyalty_members')
      .update({ points_balance: newBalance })
      .eq('id', memberId);

    if (updateErr) throw updateErr;

    // 3. Create Redemption Code
    const code = `OGL-REDEEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Valid for 30 days

    const { data: redemption, error: redeemErr } = await supabase
      .from('redemptions')
      .insert([{
        member_id: memberId,
        reward_id: rewardId,
        points_spent: reward.points_required,
        redemption_code: code,
        expires_at: expiresAt.toISOString(),
        status: 'Active'
      }])
      .select()
      .single();

    if (redeemErr) throw redeemErr;

    // 4. Log history
    await this.logPoints(memberId, -reward.points_required, 'redemption', `Redeemed: ${reward.name}`);

    return { success: true, code, redemption };
  },

  async checkAchievements(memberId) {
    // Minimal mock for checking achievements
    // In production, you'd aggregate user stats and match threshold logic
    // We will just fetch the achievements to show the UI
    const { data: member } = await supabase.from('loyalty_members').select('*').eq('id', memberId).single();
    if(!member) return;

    const { data: achievements } = await supabase.from('achievements').select('*');
    if(!achievements) return;

    for (const ach of achievements) {
       // Mock threshold checks
       let unlocked = false;
       if (ach.achievement_type === 'tier' && ach.points_threshold <= member.lifetime_points) unlocked = true;
       // We would add logic for gift_count by querying order_events etc.
       
       if (unlocked) {
           await supabase.from('member_achievements').insert([{
               member_id: memberId,
               achievement_id: ach.id,
           }]).select().single().then(({error}) => { /* ignore unique constraints */ });
       }
    }
  }
};