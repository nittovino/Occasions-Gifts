import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Gift, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';

const ClaimGiftCard = () => {
  const { getItem, setItem } = useLocalStorage();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [code, setCode] = useState('');
  const [claimedCard, setClaimedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClaim = () => {
    setLoading(true);

    try {
      const giftCards = getItem('gift_cards') || [];
      const card = giftCards.find(c => c.code === code.toUpperCase() && c.status === 'active');

      if (!card) {
        toast({
          title: t('invalidCode'),
          description: t('invalidCodeDesc'),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setClaimedCard(card);
      toast({
        title: t('giftCardActive'),
        description: t('successClaim'),
      });
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

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('claimGiftCard')} - Occasions Gifts</title>
        <meta name="description" content="Claim your gift card balance" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="text-center mb-8">
            <Gift className="h-16 w-16 text-[#d4af37] mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-white mb-4">
              {t('claimGiftCard')}
            </h1>
            <p className="text-xl text-slate-300">
              {t('enterCode')}
            </p>
          </div>

          {!claimedCard ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{t('enterCode')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">{t('giftCardType')}</label>
                  <Input
                    type="text"
                    placeholder="e.g., GC12345678"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="text-lg font-mono"
                  />
                </div>

                <Button
                  onClick={handleClaim}
                  disabled={!code || loading}
                  className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a] font-semibold text-lg py-6"
                >
                  {loading ? t('checking') : t('claimGiftCard')}
                </Button>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    {t('claimNote')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">{t('giftCardActive')}</h2>
                <p className="text-slate-300 mb-6">{t('successClaim')}</p>
                
                <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-slate-400 mb-2">{t('availableBalance')}</p>
                  <p className="text-4xl font-bold text-[#d4af37]">€{claimedCard.balance.toFixed(2)}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Code: {claimedCard.code}</p>
                  <p className="text-sm text-slate-400">Type: {claimedCard.type === 'universal' ? t('universalCard') : t('storeSpecificCard')}</p>
                </div>

                <Button
                  onClick={() => {
                    setClaimedCard(null);
                    setCode('');
                  }}
                  variant="outline"
                  className="mt-6 text-white border-slate-600"
                >
                  {t('checkAnother')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClaimGiftCard;