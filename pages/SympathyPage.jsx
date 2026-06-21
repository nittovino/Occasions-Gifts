import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OccasionCard from '@/components/OccasionCard';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

const SympathyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('sympathyTitle')} - Occasions Gifts</title>
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1662771742652-6f3670e63fb6" 
              alt="Sympathy Flowers" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1a2a4a]/80" />
          </div>
          <div className="relative z-10 text-center max-w-3xl px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              {t('sympathyTitle')}
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed font-light">
              {t('sympathyDesc')}
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OccasionCard occasion="Funeral" count="10+" image="https://images.unsplash.com/photo-1595156557876-b6d37651c6de" />
            <OccasionCard occasion="SympathyFlowers" count="15+" image="https://images.unsplash.com/photo-1533616688419-b79581888b8d" />
            <OccasionCard occasion="Memorial" count="8+" image="https://images.unsplash.com/photo-1603006905003-be475563bc59" />
            <OccasionCard occasion="GetWellSoon" count="12+" image="https://images.unsplash.com/photo-1584286595398-a59f21d313f5" />
          </div>
        </section>

        {/* Guidance Section */}
        <section className="py-16 bg-[#0f1a2e]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-8">Guided with Care</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-[#1a2a4a] rounded-lg border border-slate-700">
                <h3 className="text-[#d4af37] font-serif text-xl mb-3">Respectful Delivery</h3>
                <p className="text-slate-400">Our partners understand the sensitivity of these occasions and ensure dignified delivery.</p>
              </div>
              <div className="p-6 bg-[#1a2a4a] rounded-lg border border-slate-700">
                <h3 className="text-[#d4af37] font-serif text-xl mb-3">Personal Messages</h3>
                <p className="text-slate-400">Include a heartfelt card with your own words to offer comfort from afar.</p>
              </div>
              <div className="p-6 bg-[#1a2a4a] rounded-lg border border-slate-700">
                <h3 className="text-[#d4af37] font-serif text-xl mb-3">Appropriate Selection</h3>
                <p className="text-slate-400">Curated collection of traditional and modern gestures of sympathy.</p>
              </div>
            </div>
            <div className="mt-12">
              <Button onClick={() => window.location.href='/browse?occasion=SympathyFlowers'} className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-semibold rounded-full px-8 py-6">
                View Collection
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SympathyPage;