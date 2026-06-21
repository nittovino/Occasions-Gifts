import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoldButton from '@/components/GoldButton';
import { Globe, CreditCard, Truck, BadgeDollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

const PartnerOverview = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1691864484368-71c8846aaaa7" 
              alt="Partner Store" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a4a] via-[#1a2a4a]/90 to-[#1a2a4a]/40" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                {t('poHeadline')} <span className="text-[#d4af37]">Occasions</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {t('poSubheadline')}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/partner/open">
                  <GoldButton>{t('poBtnStart')}</GoldButton>
                </Link>
                <Link to="/partner/contract" className="text-white hover:text-[#d4af37] underline underline-offset-4 font-medium transition-colors">
                  {t('poBtnContract')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-[#0f1a2e]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">{t('poWhyPartner')}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{t('poWhyDesc')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Globe, title: 'poBenGlobalTitle', desc: 'poBenGlobalDesc' },
                { icon: CreditCard, title: 'poBenPaymentsTitle', desc: 'poBenPaymentsDesc' },
                { icon: Truck, title: 'poBenDeliveryTitle', desc: 'poBenDeliveryDesc' },
                { icon: BadgeDollarSign, title: 'poBenRevenueTitle', desc: 'poBenRevenueDesc' }
              ].map((benefit, idx) => (
                <div key={idx} className="bg-[#1a2a4a] p-8 rounded-2xl border border-slate-700 hover:border-[#d4af37] transition-all group hover:-translate-y-2">
                  <div className="w-14 h-14 bg-[#1a2a4a] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d4af37] transition-colors border border-[#d4af37]">
                    <benefit.icon className="h-7 w-7 text-[#d4af37] group-hover:text-[#1a2a4a]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t(benefit.title)}</h3>
                  <p className="text-slate-400 leading-relaxed">{t(benefit.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-[#1a2a4a] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-16 text-center">{t('poHowWorksTitle')}</h2>
            
            <div className="relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-700 -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                {[
                  { step: "01", title: 'poStep1Title', desc: 'poStep1Desc' },
                  { step: "02", title: 'poStep2Title', desc: 'poStep2Desc' },
                  { step: "03", title: 'poStep3Title', desc: 'poStep3Desc' },
                  { step: "04", title: 'poStep4Title', desc: 'poStep4Desc' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0f1a2e] p-8 rounded-2xl border border-slate-700 text-center relative">
                    <div className="w-12 h-12 bg-[#d4af37] text-[#1a2a4a] rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 shadow-lg shadow-[#d4af37]/20">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t(item.title)}</h3>
                    <p className="text-slate-400 text-sm">{t(item.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-[#0f1a2e] border-y border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif text-white mb-8">{t('poTrustedBy')}</h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-12 opacity-60">
               {['Tirana', 'Pristina', 'Skopje', 'Tetovo', 'Gostivar', 'Struga'].map((city) => (
                 <span key={city} className="text-xl md:text-2xl font-bold text-slate-400">{city}</span>
               ))}
            </div>
          </div>
        </section>

        {/* CTA Bottom */}
        <section className="py-24 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2a4a] to-[#0f1a2e]" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10 max-w-3xl px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">{t('poReadyGrow')}</h2>
            <Link to="/partner/open">
              <GoldButton>{t('poBtnStart')}</GoldButton>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartnerOverview;