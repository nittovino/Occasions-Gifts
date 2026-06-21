import jsPDF from 'jspdf';

export const generateTrackingToken = () => {
  return 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const generateGiftCardToken = () => {
  return 'GC-' + Math.random().toString(36).substr(2, 12).toUpperCase();
};

export const generateMembershipId = () => {
  return `OG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const calculatePayouts = (grossAmount) => {
  const commissionRate = 0.20;
  const commission = grossAmount * commissionRate;
  const net = grossAmount - commission;
  return {
    commission: Number(commission.toFixed(2)),
    net: Number(net.toFixed(2))
  };
};

export const convertCurrency = (amountEur, targetCurrency, rates = { mkd: 61.5, all: 106 }) => {
  if (targetCurrency === 'MKD') return amountEur * rates.mkd;
  if (targetCurrency === 'ALL') return amountEur * rates.all;
  return amountEur;
};

export const formatPrice = (amount, currency = 'EUR') => {
  const symbols = {
    'EUR': '€',
    'MKD': 'den',
    'ALL': 'L'
  };
  return `${symbols[currency] || currency}${Number(amount).toFixed(2)}`;
};

export const generateGiftCardPDF = (data) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5' // Gift card size
  });

  // Background
  doc.setFillColor(26, 42, 74); // Dark Navy #1a2a4a
  doc.rect(0, 0, 210, 148, 'F');

  // Border (Gold)
  doc.setDrawColor(212, 175, 55); // #d4af37
  doc.setLineWidth(2);
  doc.rect(5, 5, 200, 138);

  // Logo/Title
  doc.setTextColor(212, 175, 55); // Gold
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text("OCCASIONS GIFTS", 105, 25, { align: 'center' });

  // Gift Card Label
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text("GIFT CARD", 105, 35, { align: 'center' });

  // Amount
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.text(`€${Number(data.amount).toFixed(2)}`, 105, 55, { align: 'center' });

  // Recipient
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(12);
  doc.text(`To: ${data.recipientName || 'Valued Customer'}`, 20, 80);
  
  // Message
  if (data.message) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    const splitMessage = doc.splitTextToSize(`"${data.message}"`, 170);
    doc.text(splitMessage, 105, 90, { align: 'center' });
  }

  // Code Box
  doc.setFillColor(255, 255, 255);
  doc.rect(65, 110, 80, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.text(data.code || 'CODE-XXXX-XXXX', 105, 119, { align: 'center' });

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text("Redeem at occasions-gifts.com", 105, 135, { align: 'center' });

  doc.save(`GiftCard_${data.code || 'Demo'}.pdf`);
};

export const shareGiftCard = async (platform, data) => {
  const text = `Here is a €${data.amount} Gift Card for Occasions Gifts! Code: ${data.code}. Redeem at: https://occasions-gifts.com`;
  
  switch (platform) {
    case 'copy':
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy', err);
        return false;
      }
    case 'email':
      window.location.href = `mailto:?subject=You received a Gift Card!&body=${encodeURIComponent(text)}`;
      return true;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      return true;
    default:
      return false;
  }
};