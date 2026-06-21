// Standalone utilities that can be used outside of React components
export const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Hook wrapper for React components
export const useLocalStorage = () => {
  // Helper specifically for products within onboarding
  const getOnboardingProducts = () => {
    const draft = getStorageItem('partner_application_draft');
    return draft?.products || [];
  };

  const saveOnboardingProducts = (products) => {
    const draft = getStorageItem('partner_application_draft') || {};
    setStorageItem('partner_application_draft', {
      ...draft,
      products: products
    });
  };

  return { 
    getItem: getStorageItem, 
    setItem: setStorageItem, 
    removeItem: removeStorageItem,
    getOnboardingProducts,
    saveOnboardingProducts
  };
};

export const initializeDatabase = () => {
  // Use standalone functions directly to avoid Hook violation
  if (!getStorageItem('db_initialized')) {
    // Initialize empty collections
    setStorageItem('users', []);
    setStorageItem('stores', []);
    setStorageItem('products', []);
    setStorageItem('orders', []);
    setStorageItem('order_items', []);
    setStorageItem('gift_cards', []);
    setStorageItem('exchange_rates', [
      { currency: 'ALL', rate: 106, last_updated: new Date().toISOString() },
      { currency: 'EUR', rate: 1, last_updated: new Date().toISOString() },
      { currency: 'MKD', rate: 61.5, last_updated: new Date().toISOString() }
    ]);
    setStorageItem('payouts', []);
    setStorageItem('db_initialized', true);
  }
};

export const generateId = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};