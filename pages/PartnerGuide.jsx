import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Box, Bell, Camera, Wallet, HelpCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const GuideSection = ({ icon: Icon, title, children }) => (
  <div className="bg-[#0f1a2e] border border-slate-700 rounded-xl p-8 mb-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-full bg-[#1a2a4a] border border-[#d4af37] flex items-center justify-center">
        <Icon className="h-6 w-6 text-[#d4af37]" />
      </div>
      <h2 className="text-2xl font-serif font-bold text-white">{title}</h2>
    </div>
    <div className="space-y-4 text-slate-300">
      {children}
    </div>
  </div>
);

const PartnerGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-white mb-6">{t('pgTitle')}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('pgSubtitle')}
          </p>
        </div>

        <GuideSection icon={CheckCircle2} title={t('pgSecApproval')}>
          <p>{t('pgSecApprovalText')}</p>
          <p>{t('pgSecApprovalSub')}</p>
        </GuideSection>

        <GuideSection icon={Box} title={t('pgSecAddProd')}>
          <p>{t('pgSecAddProdIntro')}</p>
          <ol className="list-decimal pl-5 space-y-2 mt-4">
            <li>{t('pgSecAddProdStep1')}</li>
            <li>{t('pgSecAddProdStep2')}</li>
            <li>{t('pgSecAddProdStep3')}</li>
            <li>{t('pgSecAddProdStep4')}</li>
            <li>{t('pgSecAddProdStep5')}</li>
          </ol>
        </GuideSection>

        <GuideSection icon={Bell} title={t('pgSecManage')}>
          <p>{t('pgSecManageText')}</p>
          <div className="bg-[#1a2a4a] p-4 rounded-lg border border-slate-700 mt-4">
            <h4 className="font-bold text-white mb-2">{t('poHowWorksTitle')}:</h4>
            <div className="flex flex-col md:flex-row gap-4 text-sm">
              <div className="flex-1">1. {t('poStep1Title')}</div>
              <div className="hidden md:block">→</div>
              <div className="flex-1">2. {t('poStep2Title')}</div>
              <div className="hidden md:block">→</div>
              <div className="flex-1">3. {t('poStep3Title')}</div>
              <div className="hidden md:block">→</div>
              <div className="flex-1">4. {t('poStep4Title')}</div>
            </div>
          </div>
        </GuideSection>

        <GuideSection icon={Camera} title={t('pgSecProof')}>
          <p className="text-yellow-500 font-medium">{t('pgSecProofCrit')}</p>
          <p>{t('pgSecProofText')}</p>
        </GuideSection>

        <GuideSection icon={Wallet} title={t('pgSecPayouts')}>
          <p>{t('pgSecPayoutsCalc')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-[#1a2a4a] p-4 rounded-lg">
              <span className="block text-sm text-slate-400">{t('lblCutoff')}</span>
              <span className="text-lg font-bold text-white">{t('pgSecPayoutsSched')}</span>
            </div>
            <div className="bg-[#1a2a4a] p-4 rounded-lg">
              <span className="block text-sm text-slate-400">{t('poBenRevenueTitle')}</span>
              <span className="text-lg font-bold text-white">{t('pgSecPayoutsAmt')}</span>
            </div>
          </div>
        </GuideSection>

        <GuideSection icon={HelpCircle} title={t('pgSecSupport')}>
          <p>{t('pgSecSupportText')}</p>
          <p className="mt-4">Email: <a href="mailto:partners@occasions-gifts.com" className="text-[#d4af37] hover:underline">partners@occasions-gifts.com</a></p>
          <p>Response time: 24 hours</p>
        </GuideSection>

        <div className="text-center py-8">
           <Link to="/store">
             <Button className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-bold px-8 py-6 rounded-xl text-lg">
               {t('pgGoDashboard')}
             </Button>
           </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartnerGuide;