import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAffiliateLanguage } from '@/contexts/AffiliateLanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AffiliateConfirmation = () => {
  const { t } = useAffiliateLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet><title>Occasions Gifts - Success</title></Helmet>
      <Header />
      
      <main className="flex-1 py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="bg-[#0f1a2e] border-slate-700 text-center shadow-2xl">
              <CardContent className="p-10">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                
                <h1 className="text-3xl font-serif font-bold text-[#d4af37] mb-4">
                  {t('successMessage')}
                </h1>
                
                <div className="bg-[#1a2a4a] p-6 rounded-lg border border-slate-700 mt-8 text-left">
                  <h3 className="text-xl font-bold text-white mb-4">{t('nextSteps')}</h3>
                  <ul className="space-y-4 text-slate-300">
                    <li className="flex items-start"><span className="text-[#d4af37] font-bold mr-3">1.</span> {t('ns1')}</li>
                    <li className="flex items-start"><span className="text-[#d4af37] font-bold mr-3">2.</span> {t('ns2')}</li>
                    <li className="flex items-start"><span className="text-[#d4af37] font-bold mr-3">3.</span> {t('ns3')}</li>
                    <li className="flex items-start"><span className="text-[#d4af37] font-bold mr-3">4.</span> {t('ns4')}</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                  <Link to="/affiliate">
                    <Button variant="outline" className="w-full sm:w-auto border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10">
                      <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToProgram')}
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button className="w-full sm:w-auto bg-[#d4af37] text-[#1a2a4a] hover:bg-[#c19a2f] font-bold">
                      <Home className="w-4 h-4 mr-2" /> {t('backToHome')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AffiliateConfirmation;