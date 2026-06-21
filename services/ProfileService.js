import { supabase } from '@/lib/customSupabaseClient';

export const ProfileService = {
  updateProfile: async (userId, data) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return profile;
  },
  
  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  }
};