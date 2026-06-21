import { supabase } from '@/lib/customSupabaseClient';

const handleDbResponse = (res) => {
  if (res.error) return { success: false, error: res.error.message };
  return { success: true, data: res.data ? res.data[0] : null };
};

export const AdminCRUDService = {
  // Members
  addMember: async (data) => handleDbResponse(await supabase.from('loyalty_members').insert([data]).select()),
  updateMember: async (id, data) => handleDbResponse(await supabase.from('loyalty_members').update(data).eq('id', id).select()),
  deleteMember: async (id) => handleDbResponse(await supabase.from('loyalty_members').delete().eq('id', id)),
  
  // Tiers
  addTier: async (data) => handleDbResponse(await supabase.from('loyalty_tiers').insert([data]).select()),
  updateTier: async (id, data) => handleDbResponse(await supabase.from('loyalty_tiers').update(data).eq('id', id).select()),
  deleteTier: async (id) => handleDbResponse(await supabase.from('loyalty_tiers').delete().eq('id', id)),
  
  // Campaigns
  addCampaign: async (data) => handleDbResponse(await supabase.from('loyalty_campaigns').insert([data]).select()),
  updateCampaign: async (id, data) => handleDbResponse(await supabase.from('loyalty_campaigns').update(data).eq('id', id).select()),
  deleteCampaign: async (id) => handleDbResponse(await supabase.from('loyalty_campaigns').delete().eq('id', id)),
  
  // Rewards
  addReward: async (data) => handleDbResponse(await supabase.from('rewards').insert([data]).select()),
  updateReward: async (id, data) => handleDbResponse(await supabase.from('rewards').update(data).eq('id', id).select()),
  deleteReward: async (id) => handleDbResponse(await supabase.from('rewards').delete().eq('id', id)),
  
  // B2B Partners
  addPartner: async (data) => {
    const payload = {
      company_name: data.company_name,
      contact_email: data.contact_email,
      commission_rate: data.commission_rate,
      status: data.status
    };
    return handleDbResponse(await supabase.from('b2b_partners').insert([payload]).select());
  },
  updatePartner: async (id, data) => {
    const payload = {
      company_name: data.company_name,
      contact_email: data.contact_email,
      commission_rate: data.commission_rate,
      status: data.status
    };
    return handleDbResponse(await supabase.from('b2b_partners').update(payload).eq('id', id).select());
  },
  deletePartner: async (id) => handleDbResponse(await supabase.from('b2b_partners').delete().eq('id', id)),
  
  // Affiliate Partners
  addAffiliate: async (data) => {
    const payload = {
      user_id: data.user_id,
      referral_code: data.referral_code,
      commission_rate: data.commission_rate,
      status: data.status
    };
    return handleDbResponse(await supabase.from('affiliate_partners').insert([payload]).select());
  },
  updateAffiliate: async (id, data) => {
    const payload = {
      user_id: data.user_id,
      referral_code: data.referral_code,
      commission_rate: data.commission_rate,
      status: data.status
    };
    return handleDbResponse(await supabase.from('affiliate_partners').update(payload).eq('id', id).select());
  },
  deleteAffiliate: async (id) => handleDbResponse(await supabase.from('affiliate_partners').delete().eq('id', id)),
  
  // Promotions
  addPromotion: async (data) => handleDbResponse(await supabase.from('promotions').insert([data]).select()),
  updatePromotion: async (id, data) => handleDbResponse(await supabase.from('promotions').update(data).eq('id', id).select()),
  deletePromotion: async (id) => handleDbResponse(await supabase.from('promotions').delete().eq('id', id)),
};