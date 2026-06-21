import { useState } from 'react';
import { generateGiftCardToken } from '@/lib/helpers';

export const useGiftCardDemo = () => {
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to true for visibility
  const [showPreview, setShowPreview] = useState(false);
  const [demoData, setDemoData] = useState({
    amount: 50,
    recipientName: '',
    recipientEmail: '',
    message: '',
    code: ''
  });

  const toggleDemoMode = () => setIsDemoMode(prev => !prev);

  const openPreview = (formData) => {
    const code = generateGiftCardToken();
    setDemoData({
      ...formData,
      code
    });
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const updateDemoData = (key, value) => {
    setDemoData(prev => ({ ...prev, [key]: value }));
  };

  return {
    isDemoMode,
    showPreview,
    demoData,
    toggleDemoMode,
    openPreview,
    closePreview,
    updateDemoData
  };
};