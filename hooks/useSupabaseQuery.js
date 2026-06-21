import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabaseQuery = (tableName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a stable string representation of options for the dependency array
  const optionsString = JSON.stringify(options);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from(tableName).select(options.select || '*');

      if (options.eq) {
        Object.entries(options.eq).forEach(([key, value]) => {
          // Only apply filter if value is defined to prevent invalid queries
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      if (options.in) {
          Object.entries(options.in).forEach(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                query = query.in(key, value);
              }
          });
      }

      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending });
      }
      
      if (options.limit) {
          query = query.limit(options.limit);
      }
      
      if (options.single) {
          query = query.single();
      }

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData(result);
    } catch (err) {
      console.error(`Error querying ${tableName}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tableName, optionsString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};