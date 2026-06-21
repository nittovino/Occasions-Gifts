import { supabase } from '@/lib/customSupabaseClient';

export const OrderService = {
  fetchUserOrders: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_email', (await supabase.auth.getUser()).data.user?.email) // Approximate match since orders table uses buyer_email
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  fetchOrderById: async (orderId, userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  }
};