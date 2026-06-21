import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HolidayCard from '@/components/HolidayCard';
import { useTranslation } from '@/hooks/useTranslation';

const HolidaysPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>{t('religiousHolidays')} - Occasions Gifts</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t('religiousHolidays')}
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Celebrate tradition and faith with meaningful gifts for your loved ones back home.
            </p>
          </div>

          {/* Muslim Holidays */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] bg-slate-700 flex-1"></div>
              <h2 className="text-3xl font-serif font-bold text-[#d4af37] text-center">{t('muslimHolidays')}</h2>
              <div className="h-[1px] bg-slate-700 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HolidayCard 
                holiday="Ramadan"
                date="Feb 28 - Mar 29"
                image="https://images.unsplash.com/photo-1617142860117-c1097c5f9373"
                description="Share the blessings of the holy month with premium date sets, prayer rugs, and gift hampers."
              />
              <HolidayCard 
                holiday="EidalFitr"
                date="Mar 30 - Apr 1"
                image="https://images.unsplash.com/photo-1594035910387-fea477942698"
                description="Celebrate the end of Ramadan with sweet treats, perfumes, and festive family gifts."
              />
              <HolidayCard 
                holiday="EidalAdha"
                date="Jun 6 - Jun 9"
                image="https://images.unsplash.com/photo-1584286595398-a59f21d313f5"
                description="Honor the feast of sacrifice with thoughtful gifts for family and friends."
              />
            </div>
          </section>

          {/* Christian Holidays */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] bg-slate-700 flex-1"></div>
              <h2 className="text-3xl font-serif font-bold text-[#d4af37] text-center">{t('catholicHolidays')}</h2>
              <div className="h-[1px] bg-slate-700 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HolidayCard 
                holiday="Easter"
                date="April 20"
                image="https://images.unsplash.com/photo-1700467728387-16ccbe795098"
                description="Celebrate renewal with chocolate eggs, spring flowers, and festive baskets."
              />
              <HolidayCard 
                holiday="Christmas"
                date="Dec 25"
                image="https://images.unsplash.com/photo-1671601063395-9622c427e570"
                description="Spread joy this season with classic hampers, decorations, and warm winter gifts."
              />
              <HolidayCard 
                holiday="AllSaintsDay"
                date="Nov 1"
                image="https://images.unsplash.com/photo-1603006905003-be475563bc59"
                description="Remember loved ones with respectful memorial candles and flower arrangements."
              />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HolidaysPage;