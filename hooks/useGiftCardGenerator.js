import React, { useState, useEffect, useMemo } from 'react';
import { add } from 'date-fns';

const generateGiftCardCode = () => {
  const parts = [
    Math.random().toString(36).substring(2, 6).toUpperCase(),
    Math.random().toString(36).substring(2, 6).toUpperCase(),
    Math.random().toString(36).substring(2, 6).toUpperCase()
  ];
  return `OG-${parts.join('-')}`;
};

export const useGiftCardGenerator = (initialData) => {
  const [cardData, setCardData] = useState({
    amount: 50,
    recipientName: 'Valued Customer',
    senderName: 'A Friend',
    message: 'Enjoy this special gift!',
    style: 'Universal',
    ...initialData,
  });

  const [code, setCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    const newCode = generateGiftCardCode();
    setCode(newCode);

    const calculatedExpiry = add(new Date(), { years: 1 });
    setExpiryDate(calculatedExpiry.toLocaleDateString('en-CA')); // YYYY-MM-DD format

  }, []);

  useEffect(() => {
    const url = `${window.location.origin}/gift-cards/claim?code=${code}`;
    setQrCodeData(url);
  }, [code]);

  const updateStyle = (newStyle) => {
    setCardData(prev => ({ ...prev, style: newStyle }));
  };

  const giftCardDetails = useMemo(() => ({
    ...cardData,
    code,
    expiryDate,
    qrCodeData,
  }), [cardData, code, expiryDate, qrCodeData]);

  return {
    giftCardDetails,
    updateStyle,
  };
};