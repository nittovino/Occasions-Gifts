import { supabase } from '@/lib/customSupabaseClient';

/**
 * Fetches user profiles by an array of user IDs and returns a map.
 * This avoids needing to use relational joins in PostgREST queries 
 * when the foreign key relationships aren't perfectly aligned.
 * 
 * @param {Array<string>} userIds - Array of user UUIDs
 * @returns {Promise<Object>} Map of { user_id: { email, full_name } }
 */
export const fetchProfilesForUsers = async (userIds) => {
  if (!userIds || userIds.length === 0) return {};
  
  try {
    const uniqueIds = [...new Set(userIds.filter(Boolean))];
    
    // Split into chunks if there are too many IDs (PostgREST limit)
    const chunkSize = 100;
    let allData = [];
    
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
      const chunk = uniqueIds.slice(i, i + chunkSize);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', chunk);
        
      if (error) throw error;
      if (data) allData = [...allData, ...data];
    }
    
    const profileMap = {};
    allData.forEach(profile => {
      profileMap[profile.id] = {
        email: profile.email || 'Unknown',
        full_name: profile.full_name || 'Unknown'
      };
    });
    
    return profileMap;
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return {}; // Return empty map on error to prevent breaking UI
  }
};