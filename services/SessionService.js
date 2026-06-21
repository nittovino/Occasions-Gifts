import { supabase } from '@/lib/supabase';

export const SessionService = {
  async createSession(userId, sessionData) {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([{
        user_id: userId,
        ...sessionData,
        last_active: new Date()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async fetchUserSessions(userId) {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('last_active', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteSession(sessionId, userId) {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  async deleteAllSessions(userId) {
    // In a real scenario, we might keep the current session token to avoid self-logout
    // But for "Log out all devices", we often mean including current, or handled by auth provider
    // Supabase Auth handles the actual session validity. This table is mostly for visibility.
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
};