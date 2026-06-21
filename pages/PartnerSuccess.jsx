import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, LayoutDashboard, ArrowRight, ClipboardCheck, ShieldCheck, ThumbsUp, Store } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PartnerSuccess = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    // Try to get company name if it was saved or is still in draft before it was fully cleared
    try {
      const draft = localStorage.getItem('partner_application_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.storeName || parsed.company_name) {
          setCompanyName(parsed.storeName || parsed.company_name);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  const steps = [
    { icon: <ClipboardCheck className="w-5 h-5 text-[#d4af37]" />, text: "Application review" },
    { icon: <ShieldCheck className="w-5 h-5 text-[#d4af37]" />, text: "Business verification" },
    { icon: <ThumbsUp className="w-5 h-5 text-[#d4af37]" />, text: "Partner approval" },
    { icon: <Store className="w-5 h-5 text-[#d4af37]" />, text: "Store activation" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 md:py-24">
        <div className="bg-[#0f1a2e] border border-slate-700 rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-500/10 blur-[50px] rounded-full pointer-events-none"></div>

          <div className="mx-auto w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-8 relative z-10">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 relative z-10">
            Application Submitted Successfully
          </h1>
          
          <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl mx-auto relative z-10">
            Thank you for your interest in becoming an Occasions Gifts Partner Store. Your application has been received and is currently under review. Our team will contact you within <strong className="text-white">2–5 business days</strong>.
          </p>

          {companyName && (
            <div className="inline-block bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-3 mb-8">
              <span className="text-slate-400 text-sm uppercase tracking-wider">Company Registered</span>
              <p className="text-white font-medium text-lg mt-1">{companyName}</p>
            </div>
          )}

          <div className="bg-[#1a2a4a] border border-slate-700 rounded-xl p-6 text-left mb-10 mx-auto max-w-lg relative z-10">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              What happens next:
            </h3>
            <ul className="space-y-4">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center space-x-3 text-slate-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-shrink-0">
                    {step.icon}
                  </div>
                  <span className="font-medium">{step.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full sm:w-auto min-w-[160px] h-12 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
            <Button 
              onClick={() => navigate('/partner/dashboard')}
              className="w-full sm:w-auto min-w-[220px] h-12 bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-bold transition-all shadow-[0_4px_12px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Open Partner Dashboard
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerSuccess;