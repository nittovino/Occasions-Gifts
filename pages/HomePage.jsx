import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, Flower, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/LanguageContext';
import { initializeDatabase } from '@/hooks/useLocalStorage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { seedDatabase } from '@/data/seedData';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OccasionCard from '@/components/OccasionCard';
import HolidayCard from '@/components/HolidayCard';

const HomePage = () => {
  const { t } = useTranslation();
  const { getItem, setItem } = useLocalStorage();
  const navigate = useNavigate();
  const { currentUser } = useSupabaseAuth();

  useEffect(() => {
    initializeDatabase();
    const users = getItem('users') || [];
    if (users.length === 0) {
      seedDatabase(setItem);
    }
  }, []);

  const handleJoinNow = () => {
    if (currentUser) {
      navigate('/loyalty-dashboard');
    } else {
      navigate('/signup', { state: { from: 'loyalty' } });
    }
  };

  const handleLearnMore = () => {
    navigate('/loyalty-members');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('brandName')} - {t('heroTitle')}</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://horizons-cdn.hostinger.com/ff127f75-941b-4fb4-a5da-6d2a6491255b/adobestock_1346914559-jLI6B.jpeg" alt="Luxury Gift" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a4a] via-[#1a2a4a]/70 to-transparent" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
                {t('heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed font-light">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/occasions">
                  <Button size="lg" className="bg-[#d4af37] hover:bg-[#c19a2f] text-[#1a2a4a] font-bold text-lg px-8 py-7 rounded-full shadow-xl">
                    {t('shopByOccasion')}
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1a2a4a] font-semibold text-lg px-8 py-7 rounded-full">
                    {t('shopNow')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-[#0f1a2e]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{t('shopByOccasion')}</h2>
                <p className="text-slate-400 text-lg">{t('emotionalMessage')}</p>
              </div>
              <Link to="/occasions" className="hidden md:flex items-center text-[#d4af37] hover:text-white transition-colors font-medium">
                {t('viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <OccasionCard occasion="Birthday" count="45+" image="https://images.unsplash.com/photo-1558636508-e0db3814bd1d" />
              <OccasionCard occasion="Wedding" count="30+" image="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8" />
              <OccasionCard occasion="NewBaby" count="25+" image="https://images.unsplash.com/photo-1519689680058-324335c77eba" />
              
              <motion.div whileHover={{ y: -8 }} className="group relative h-[320px] rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
                 <Link to="/sympathy">
                   <div className="absolute inset-0">
                     <img src="https://images.unsplash.com/photo-1603006905003-be475563bc59" alt={t('funeralsCondolences')} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a4a] via-[#1a2a4a]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start">
                      <div className="bg-[#1a2a4a]/50 backdrop-blur-sm p-2 rounded-full mb-3 text-[#d4af37] border border-[#d4af37]/30">
                        <Flower className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">{t('funeralsCondolences')}</h3>
                      <p className="text-slate-300 text-sm mb-4">{t('sendComfort')}</p>
                      <Button className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white transition-all font-semibold rounded-full px-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                        {t('viewCollection')} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                   </div>
                 </Link>
              </motion.div>

              <OccasionCard occasion="Anniversary" count="20+" image="https://images.unsplash.com/photo-1518199266791-5375a83190b7" />
              <OccasionCard occasion="Graduation" count="15+" image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1" />
              <OccasionCard occasion="NewHome" count="18+" image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" />
              
              <div className="group relative h-[320px] bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-700 hover:border-[#d4af37] transition-all cursor-pointer">
                <Link to="/occasions" className="text-center">
                  <span className="block text-2xl text-slate-400 group-hover:text-[#d4af37] font-serif mb-2">{t('viewAll')}</span>
                  <span className="block text-sm text-slate-500">{t('viewCategories')}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#1a2a4a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">{t('religiousHolidays')}</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">Honor traditions with gifts that matter.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HolidayCard holiday="Ramadan" date="Feb 28 - Mar 29" image="https://images.unsplash.com/photo-1617142860117-c1097c5f9373" description="Dates, prayer beads, and festive hampers for the holy month." />
              <HolidayCard holiday="Easter" date="April 20" image="https://images.unsplash.com/photo-1700467728387-16ccbe795098" description="Chocolates and spring flowers to celebrate renewal." />
              <HolidayCard holiday="EidalFitr" date="Mar 30 - Apr 1" image="https://images.unsplash.com/photo-1594035910387-fea477942698" description="Joyous gifts to mark the end of fasting with family." />
            </div>
            
            <div className="text-center mt-12">
              <Link to="/holidays">
                <Button variant="outline" size="lg" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a2a4a]">
                  {t('viewAll')} {t('holidays')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Loyalty Club Section */}
        <section className="py-24 bg-[#0f1b2e] border-y border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <Crown className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Occasions Loyalty Club</h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Earn points on every gift, unlock exclusive rewards, and reach new tiers of gifting excellence. Join our community today and start saving.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={handleJoinNow} 
                  size="lg" 
                  className="bg-[#d4af37] hover:bg-[#c19a2f] text-black font-bold text-lg px-8 py-6 rounded-full"
                >
                  Join Now
                </Button>
                <Button 
                  onClick={handleLearnMore} 
                  size="lg" 
                  variant="outline" 
                  className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold text-lg px-8 py-6 rounded-full"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#d4af37] opacity-95" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a2a4a] mb-8">
              {t('readyToSend')}
            </h2>
            <Link to="/occasions">
              <Button size="lg" className="bg-[#1a2a4a] text-white hover:bg-[#0f1a2e] text-lg px-10 py-6 rounded-full shadow-xl">
                {t('startShopping')}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;