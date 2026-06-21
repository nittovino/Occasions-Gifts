import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useProductDraft = (merchantId) => {
  const { setItem, getItem, removeItem } = useLocalStorage();
  const draftKey = merchantId ? `product_draft_${merchantId}` : null;
  const [lastSaved, setLastSaved] = useState(null);

  const saveDraft = useCallback((data) => {
    if (!draftKey) return;
    setItem(draftKey, {
      ...data,
      savedAt: new Date().toISOString()
    });
    setLastSaved(new Date());
  }, [draftKey, setItem]);

  const loadDraft = useCallback(() => {
    if (!draftKey) return null;
    return getItem(draftKey);
  }, [draftKey, getItem]);

  const clearDraft = useCallback(() => {
    if (!draftKey) return;
    removeItem(draftKey);
    setLastSaved(null);
  }, [draftKey, removeItem]);

  const isDraftAvailable = useCallback(() => {
    if (!draftKey) return false;
    return !!getItem(draftKey);
  }, [draftKey, getItem]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    isDraftAvailable,
    lastSaved
  };
};