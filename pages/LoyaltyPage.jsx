import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Crown, Gift, Heart, Star, CheckCircle2, Copy, Wallet, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

const LoyaltyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useSupabaseAuth();
  const { toast } = useToast();

  const handleViewDashboard = () => navigate('/loyalty-dashboard');
  const handleJoinNow = () => navigate('/signup');
  const handleLearnMore = () => navigate('/loyalty-members');
  const handleRedeem = () => navigate('/loyalty-dashboard?tab=rewards');
  
  const handleCopyReferral = () => {
    navigator.clipboard.writeText('https://occasions.gifts/ref/GIFT2026');
    toast({
      title: "Success",
      description: "Referral link copied to clipboard!",
    });
  };

  const handleAppleWallet = () => {
    toast({
      description: "Coming soon: Add to Apple Wallet",
    });
  };

  const handleGoogleWallet = () => {
    toast({
      description: "Coming soon: Add to Google Wallet",
    });
  };

  const handleMainAction = () => {
    if (currentUser) {
      handleViewDashboard();
    } else {
      handleJoinNow();
    }
  };

  const tiers = [
    {
      name: 'Silver',
      points: '0 - 2,999',
      earningExample: 'Spend €100 → 100 points = €1.00',
      benefits: ['1x Points on purchases', 'Member-only gift offers', 'Standard support'],
      color: 'bg-slate-300',
      textColor: 'text-slate-800'
    },
    {
      name: 'Gold',
      points: '3,000 - 9,999',
      earningExample: 'Spend €100 → 150 points = €1.50',
      benefits: ['1.5x Points on purchases', 'Free standard shipping', 'Referral bonus rewards', 'Priority support'],
      color: 'bg-amber-400',
      textColor: 'text-amber-900',
      popular: true
    },
    {
      name: 'Platinum',
      points: '10,000+',
      earningExample: 'Spend €100 → 200 points = €2.00',
      benefits: ['2x Points on purchases', 'Free expedited shipping', 'Premium gift concierge', 'Dedicated concierge', 'Exclusive VIP gifts'],
      color: 'bg-slate-800',
      textColor: 'text-white',
      borderColor: 'border-[#d4af37]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a2a4a] text-white flex flex-col">
      <Helmet><title>Loyalty Club - Occasions Gifts</title></Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#0f1b2e] z-0"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Crown className="w-20 h-20 text-[#d4af37] mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                Occasions Loyalty Club
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed">
                Elevate your gifting experience. Earn points on every purchase, unlock exclusive tiers, and redeem for meaningful rewards.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={handleMainAction}
                  size="lg" 
                  className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#c19a2f] text-black font-bold text-lg px-8 h-14 rounded-full"
                >
                  {currentUser ? 'Go to Dashboard' : 'Join for Free'}
                </Button>
                {currentUser && (
                  <Button 
                    onClick={handleRedeem}
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-bold text-lg px-8 h-14 rounded-full"
                  >
                    Redeem Points
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-[#1a2a4a]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#15233e] rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
                  <Heart className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Join</h3>
                <p className="text-slate-400">Create an account for free and instantly become a Silver member.</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-[#15233e] rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
                  <Star className="w-10 h-10 text-[#d4af37]" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Earn Points</h3>
                <p className="text-slate-400">Get points for every €1 spent and reviewing products.</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-[#15233e] rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
                  <Gift className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Redeem</h3>
                <p className="text-slate-400">Use your points for discounts, free shipping, or exclusive gifts for your loved ones.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How Points Work / Tiers */}
        <section className="py-20 bg-[#0f1b2e]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">How Points Work</h2>
              <div className="bg-[#15233e] border border-slate-700 rounded-2xl p-6 shadow-lg inline-block">
                <p className="text-xl text-[#d4af37] font-bold mb-2">1 point = €0.01 (1 cent)</p>
                <p className="text-slate-300">Points can be redeemed for discounts and rewards on future purchases.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => (
                <div 
                  key={index}
                  className={`relative rounded-3xl p-8 flex flex-col ${tier.color} ${tier.textColor} ${tier.borderColor ? `border-2 ${tier.borderColor}` : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-serif font-bold mb-2">{tier.name}</h3>
                    <p className="opacity-80 font-medium mb-4">{tier.points} Points</p>
                    <div className="bg-black/10 rounded-lg p-3 text-sm font-semibold">
                      {tier.earningExample}
                    </div>
                  </div>
                  
                  <ul className="space-y-4 flex-1 mt-4">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className={`w-5 h-5 mr-3 flex-shrink-0 ${tier.name === 'Platinum' ? 'text-[#d4af37]' : 'opacity-70'}`} />
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 pt-8 border-t border-current/20 text-center">
                    <Button 
                      onClick={handleMainAction}
                      variant={tier.name === 'Platinum' ? 'default' : 'outline'}
                      className={`w-full ${tier.name === 'Platinum' ? 'bg-[#d4af37] hover:bg-[#c19a2f] text-black border-none' : 'border-current hover:bg-current/10'}`}
                    >
                      {currentUser ? 'View Dashboard' : 'Join Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Referral & Digital Wallet Section */}
        <section className="py-20 bg-[#1a2a4a]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Referral Block */}
              <div className="bg-[#15233e] border border-slate-700 rounded-3xl p-8 lg:p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1a2a4a] rounded-full flex items-center justify-center mb-6 text-[#d4af37]">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Invite Friends, Earn Rewards</h2>
                <p className="text-slate-300 mb-6 flex-1">
                  Share the joy of gifting. Earn <strong className="text-[#d4af37]">500 points</strong> per successful referral when your friends make their first purchase.
                </p>
                <Button 
                  onClick={handleCopyReferral}
                  className="w-full max-w-xs bg-[#d4af37] hover:bg-[#c19a2f] text-black font-bold h-12 rounded-xl flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy Referral Link
                </Button>
              </div>

              {/* Digital Wallet Block */}
              <div className="bg-[#15233e] border border-slate-700 rounded-3xl p-8 lg:p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1a2a4a] rounded-full flex items-center justify-center mb-6 text-blue-400">
                  <Wallet className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Digital Membership Card</h2>
                <p className="text-slate-300 mb-8 flex-1">
                  Keep your loyalty status handy. Add your digital membership card to your smartphone wallet.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs justify-center">
                  <Button 
                    onClick={handleAppleWallet}
                    variant="outline"
                    className="flex-1 border-slate-600 text-white hover:bg-slate-800 h-12 rounded-xl"
                  >
                    Apple Wallet
                  </Button>
                  <Button 
                    onClick={handleGoogleWallet}
                    variant="outline"
                    className="flex-1 border-slate-600 text-white hover:bg-slate-800 h-12 rounded-xl"
                  >
                    Google Wallet
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LoyaltyPage;