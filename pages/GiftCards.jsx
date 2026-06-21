import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { useLocalStorage, generateId } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

// New Imports for Demo Functionality
import HowDemoGiftCardsWork from '@/components/HowDemoGiftCardsWork';
import GiftCardPreviewModal from '@/components/GiftCardPreviewModal';
import { useGiftCardDemo } from '@/hooks/useGiftCardDemo';

const GiftCards = () => {
  const { getItem, setItem } = useLocalStorage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Demo Hooks
  const { 
    isDemoMode, 
    showPreview, 
    demoData, 
    closePreview, 
    toggleDemoMode 
  } = useGiftCardDemo();

  const [cardType] = useState('universal');
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAmounts = [20, 50, 100, 200];

  const handlePurchase = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (finalAmount < 20 || finalAmount > 200) {
      toast({
        title: t('invalidAmount'),
        description: t('invalidAmountDesc'),
        variant: "destructive",
      });
      return;
    }
    
    const generatedCardData = {
      amount: finalAmount,
      recipientName,
      recipientEmail,
      senderName: senderName || "A Friend",
      message,
      type: cardType,
      id: generateId(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      code: 'GC' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    };

    if (isDemoMode) {
      toast({
        title: "Demo Card Created!",
        description: "Redirecting you to the generator page...",
      });
      navigate(`/gift-card/${generatedCardData.id}`, { state: { cardData: generatedCardData } });
      return;
    }

    // Real Purchase Logic (Simulated)
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const giftCards = getItem('gift_cards') || [];
      const newCard = {
        ...generatedCardData,
        balance: finalAmount,
        status: 'active',
        created_at: new Date().toISOString()
      };

      giftCards.push(newCard);
      setItem('gift_cards', giftCards);

      toast({
        title: t('giftCardPurchased'),
        description: `Your gift card is ready. Redirecting...`,
      });
      
      navigate(`/gift-card/${newCard.id}`, { state: { cardData: newCard } });

    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToPurchase = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('giftCards')} - Occasions Gifts</title>
        <meta name="description" content="Purchase gift cards for your loved ones" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="page-logo-container mb-6 flex justify-center">
                <Logo width="120px" href="/" />
              </div>
              <h1 className="text-5xl font-serif font-bold text-white mb-4">
                {t('giftCards')}
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
                {t('giveChoice')}
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                 <span className={cn(
                   "text-sm font-bold transition-colors duration-300",
                   isDemoMode ? "text-[#d4af37]" : "text-slate-400"
                 )}>
                   {isDemoMode ? 'Demo Mode Active' : 'Live Mode'}
                 </span>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={toggleDemoMode}
                   className="text-xs text-[#d4af37] hover:text-white hover:bg-[#d4af37]/20 h-6 border border-[#d4af37]/30 rounded-full px-3"
                 >
                   Switch Mode
                 </Button>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {/* Purchase Gift Card */}
            <div className="lg:col-span-2">
              <Card className="bg-[#0f1a2e] border-slate-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-serif">
                    {isDemoMode ? "Create Demo Gift Card" : t('purchaseGiftCard')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-3 block">{t('selectAmount')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {presetAmounts.map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => { setAmount(amt); setCustomAmount(''); }}
                          className={cn(
                            "py-3 px-4 rounded-md font-bold text-base transition-all duration-300 border flex items-center justify-center",
                            amount === amt && !customAmount
                              ? "bg-[#D4AF37] border-[#D4AF37] text-white shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
                              : "bg-[#F3F4F6] border-[#E5E7EB] text-[#1a2a4a] hover:bg-[#E5E7EB]"
                          )}
                        >
                          €{amt}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                      <Input
                        type="number" 
                        min="20" 
                        max="200" 
                        placeholder={t('customAmount')}
                        value={customAmount} 
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="bg-[#1a2a4a] border-slate-700 text-white pl-8 h-12 text-lg focus:border-[#D4AF37] transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <label className="text-sm font-bold text-slate-300 mb-2 block">Your Name</label>
                      <Input type="text" placeholder="e.g. John" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="bg-[#1a2a4a] border-slate-700 text-white h-11" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-300 mb-2 block">Recipient Name</label>
                      <Input type="text" placeholder="e.g. Maria" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="bg-[#1a2a4a] border-slate-700 text-white h-11" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">{t('recipientEmail')} (Optional)</label>
                    <Input type="email" placeholder="recipient@email.com" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="bg-[#1a2a4a] border-slate-700 text-white h-11" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-300 mb-2 block">Personal Message</label>
                    <Input placeholder="Add a sweet note..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength={100} className="bg-[#1a2a4a] border-slate-700 text-white h-11" />
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg text-white font-serif">{t('totalAmount')}</span>
                      <span className="text-3xl font-bold text-[#d4af37]">
                        €{customAmount || amount}
                      </span>
                    </div>
                    <Button 
                      onClick={handlePurchase} 
                      disabled={loading} 
                      className="w-full h-14 bg-[#D4AF37] hover:bg-[#C9A227] active:bg-[#B8941F] text-white font-bold text-xl rounded-md shadow-[0_4px_12px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_16px_rgba(212,175,55,0.3)] transition-all duration-300 border-none"
                    >
                      {loading ? t('processing') : (isDemoMode ? "Generate Demo Card" : t('purchaseGiftCard'))}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
               <Card className="bg-[#0f1a2e] border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center font-serif">
                    <Tag className="h-5 w-5 mr-2 text-[#d4af37]" />
                    {t('howItWorks')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p className="flex items-start gap-3">
                    <span className="bg-[#d4af37] text-[#1a2a4a] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    Fill in the details on the left.
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="bg-[#d4af37] text-[#1a2a4a] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    Click 'Generate Demo Card'.
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="bg-[#d4af37] text-[#1a2a4a] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    You'll be taken to a new page to manage your card.
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="bg-[#d4af37] text-[#1a2a4a] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    There you can view, print, and share your generated gift card.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#0f1a2e] border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white font-serif">{t('needToRedeem')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">{t('haveCode')}</p>
                  <Link to="/gift-cards/claim">
                    <Button 
                      className="w-full h-12 bg-white border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#FEF3C7] active:bg-[#D4AF37] active:text-white font-bold rounded-md shadow-[0_2px_8px_rgba(212,175,55,0.1)] transition-all duration-300"
                    >
                      {t('claimGiftCard')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <HowDemoGiftCardsWork onTryDemo={scrollToPurchase} />
      </main>
      <Footer />
      <GiftCardPreviewModal 
        isOpen={showPreview} 
        onClose={closePreview} 
        data={demoData} 
        onSendAnother={() => { closePreview(); scrollToPurchase(); }} 
      />
    </div>
  );
};

export default GiftCards;