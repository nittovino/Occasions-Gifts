import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Download, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generatePartnerAgreementPDF } from '@/lib/generatePartnerAgreementPDF';
import { useToast } from '@/components/ui/use-toast';

// Import raw data for specific language selection
import enData from '@/locales/en.json';
import alData from '@/locales/al.json';
import mkData from '@/locales/mk.json';

const rawLocales = {
  en: enData,
  sq: alData,
  mk: mkData
};

const ContractSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-700 rounded-xl bg-[#0f1a2e] overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1a2a4a] transition-colors"
      >
        <h3 className="text-lg font-bold text-[#d4af37] font-serif">{title}</h3>
        {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

const PartnerContract = () => {
  const { language: globalLanguage } = useTranslation();
  const { setItem, getItem } = useLocalStorage();
  const { toast } = useToast();
  
  const [contractLang, setContractLang] = useState(() => {
    return getItem('partnerContractLanguage') || globalLanguage || 'en';
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setItem('partnerContractLanguage', contractLang);
  }, [contractLang, setItem]);

  const tLocal = (path) => {
    const localeData = rawLocales[contractLang] || rawLocales['en'];
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, localeData) || path;
  };

  const sections = tLocal('partnerAgreement.sections');

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await generatePartnerAgreementPDF(contractLang);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Occasions_Gifts_Partner_Agreement_${contractLang.toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your partner agreement PDF is ready.",
        className: "bg-[#0f1a2e] border-slate-700 text-white"
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a] text-slate-200">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        
        <div className="flex justify-center mb-8">
           <div className="bg-[#0f1a2e] border border-slate-700 rounded-lg p-1 inline-flex">
              {['en', 'sq', 'mk'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setContractLang(lang)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${contractLang === lang ? 'bg-[#d4af37] text-[#1a2a4a] font-bold shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  {lang === 'en' ? 'English' : lang === 'sq' ? 'Shqip' : 'Македонски'}
                </button>
              ))}
           </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            {tLocal('partnerAgreement.title')}
          </h1>
          <p className="text-slate-400">
            {tLocal('partnerAgreement.version')} • {tLocal('partnerAgreement.effectiveDate')}
          </p>
        </div>

        <div className="space-y-6">
          {Array.isArray(sections) && sections.map((section, index) => (
            <ContractSection 
              key={index} 
              title={section.title} 
              defaultOpen={index === 0}
            >
              <p>{section.content}</p>
            </ContractSection>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center bg-[#0f1a2e] p-8 rounded-xl border border-slate-700 gap-6">
          <Button 
            variant="outline" 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="border-slate-600 text-slate-300 hover:text-white w-full sm:w-auto min-w-[160px]"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isGenerating ? "Generating..." : tLocal('partnerAgreement.buttons.downloadPdf')}
          </Button>
          
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <Link to="/partner/open" className="w-full sm:w-auto">
              <Button className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-bold w-full sm:min-w-[200px]">
                {tLocal('partnerAgreement.buttons.acceptAndContinue')}
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-slate-500">
          <a href="mailto:partners@occasions-gifts.com" className="text-[#d4af37] hover:underline">partners@occasions-gifts.com</a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartnerContract;