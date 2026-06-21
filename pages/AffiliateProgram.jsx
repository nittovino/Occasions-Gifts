import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAffiliateLanguage } from '@/contexts/AffiliateLanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle2, UserPlus, Share2, DollarSign, HelpCircle, Star } from 'lucide-react';

const AffiliateProgram = () => {
  const { t } = useAffiliateLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet>
        <title>Occasions Gifts - {t('heroTitle')}</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 text-white">
        <div className="container mx-auto px-4 py-8 flex justify-end">
           <LanguageSwitcher />
        </div>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#1a2a4a] to-[#0f1a2e] text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-6xl font-serif font-bold text-[#d4af37] mb-6"
          >
            {t('heroTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10"
          >
            {t('heroSubtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/affiliate-signup">
              <Button size="lg" className="bg-[#d4af37] text-[#1a2a4a] hover:bg-[#c19a2f] font-bold px-10 py-6 text-lg rounded-full">
                {t('applyNow')}
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-[#0f1a2e]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">{t('howItWorks')}</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <UserPlus size={32} />
                </div>
                <h3 className="text-xl font-bold">{t('step1Title')}</h3>
                <p className="text-slate-400">{t('step1Desc')}</p>
              </div>
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <Share2 size={32} />
                </div>
                <h3 className="text-xl font-bold">{t('step2Title')}</h3>
                <p className="text-slate-400">{t('step2Desc')}</p>
              </div>
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-xl font-bold">{t('step3Title')}</h3>
                <p className="text-slate-400">{t('step3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Requirements */}
        <section className="py-20 bg-[#1a2a4a]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <Card className="bg-[#0f1a2e] border-slate-700 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold mb-6 text-[#d4af37]">{t('benefitsTitle')}</h3>
                  <ul className="space-y-4">
                    {t('benefits').map((benefit, i) => (
                      <li key={i} className="flex items-center text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-[#d4af37] mr-3" /> {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-[#0f1a2e] border-slate-700 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold mb-6 text-[#d4af37]">{t('reqTitle')}</h3>
                  <p className="text-slate-300 leading-relaxed">{t('reqDesc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-[#0f1a2e]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">{t('testimonialsTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {t('testimonials').map((t_item, i) => (
                <Card key={i} className="bg-[#1a2a4a] border-slate-700 text-white text-center">
                  <CardContent className="p-8 flex flex-col items-center">
                    <div className="flex text-[#d4af37] mb-4">
                      {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                    </div>
                    <p className="italic text-slate-300 mb-6">"{t_item.text}"</p>
                    <h4 className="font-bold text-white">{t_item.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[#1a2a4a]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">{t('faqTitle')}</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {t('faqs').map((faq, i) => (
                <div key={i} className="bg-[#0f1a2e] p-6 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-lg mb-2 flex items-start">
                    <HelpCircle className="w-5 h-5 text-[#d4af37] mr-3 mt-0.5 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-slate-400 pl-8">{faq.a}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Link to="/affiliate-signup">
                <Button size="lg" className="bg-[#d4af37] text-[#1a2a4a] hover:bg-[#c19a2f] font-bold px-10 py-6 text-lg rounded-full">
                  {t('applyNow')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AffiliateProgram;