import { supabase } from '@/lib/supabase';

export const AddressService = {
  async fetchUserAddresses(userId) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createAddress(userId, addressData) {
    if (addressData.is_default) {
      await this.clearDefaultAddress(userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert([{ ...addressData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAddress(addressId, addressData) {
    // We need userId to handle defaults logic, assuming addressData includes it or we fetch it
    // For simplicity, if setting default, we clear others first for the user associated with this address
    if (addressData.is_default) {
       const { data: current } = await supabase.from('addresses').select('user_id').eq('id', addressId).single();
       if (current) await this.clearDefaultAddress(current.user_id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(addressData)
      .eq('id', addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAddress(addressId) {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) throw error;
    return true;
  },

  async setDefaultAddress(addressId, userId) {
    await this.clearDefaultAddress(userId);
    
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async clearDefaultAddress(userId) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }
};