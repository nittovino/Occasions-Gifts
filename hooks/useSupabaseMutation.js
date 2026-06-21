import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useSupabaseMutation = (tableName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const insert = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from(tableName)
        .insert(data)
        .select();
      if (err) throw err;
      return result;
    } catch (err) {
      setError(err);
      console.error(`Error inserting into ${tableName}:`, err);
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: err.message || "Failed to create record."
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
      if (err) throw err;
      return result;
    } catch (err) {
      setError(err);
      console.error(`Error updating ${tableName}:`, err);
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: err.message || "Failed to update record."
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (err) throw err;
      return true;
    } catch (err) {
      setError(err);
      console.error(`Error deleting from ${tableName}:`, err);
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: err.message || "Failed to delete record."
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { insert, update, remove, loading, error };
};