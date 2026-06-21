import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronRight, ChevronLeft, Check, Download, Loader2 } from 'lucide-react';
import { validateEmail } from '@/lib/validators';
import ProductList from '@/components/ProductList';
import { generatePartnerAgreementPDF } from '@/lib/generatePartnerAgreementPDF';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

const PartnerOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setItem, getItem } = useLocalStorage();
  const { signup, currentUser } = useSupabaseAuth();
  const { t } = useTranslation();
  
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    website: '',
    language: 'en',
    storeName: '',
    businessType: '',
    country: '',
    city: '',
    address: '',
    radius: '10',
    sameDay: false,
    cutoffTime: '14:00',
    deliveryFee: '5',
    products: [], 
    iban: '',
    bankName: '',
    accountHolder: '',
    agreeCommission: false,
    agreePayout: false,
    agreeTerms: false,
    signatureName: '',
    commission_rate: 0
  });

  useEffect(() => {
    const saved = getItem('partner_application_draft');
    if (saved) {
      setFormData(prev => ({ ...prev, ...saved }));
    }
    if (currentUser) {
       setFormData(prev => ({ ...prev, email: currentUser.email, fullName: currentUser.user_metadata?.full_name || '' }));
    }
  }, []);

  useEffect(() => {
    setItem('partner_application_draft', formData);
  }, [formData, setItem]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!validateEmail(formData.email)) { toast({ title: "Invalid Email", variant: "destructive" }); return false; }
      if (!currentUser && formData.password.length < 8) { toast({ title: "Password too short", variant: "destructive" }); return false; }
      if (!currentUser && formData.password !== formData.confirmPassword) { toast({ title: "Passwords do not match", variant: "destructive" }); return false; }
      if (!formData.fullName) { toast({ title: "Name required", variant: "destructive" }); return false; }
    }
    if (currentStep === 2) {
      if (!formData.storeName || !formData.city) { toast({ title: "Required fields missing", variant: "destructive" }); return false; }
    }
    if (currentStep === 4) {
      if (!formData.products || formData.products.length < 1) { 
        toast({ 
          title: "Product Required", 
          description: "Please add at least 1 product to continue",
          variant: "destructive" 
        }); 
        return false; 
      }
    }
    if (currentStep === 5) {
        if (!formData.agreeCommission || !formData.agreePayout) { toast({ title: "Please agree to payout terms", variant: "destructive" }); return false; }
    }
    return true;
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const blob = await generatePartnerAgreementPDF('en'); 
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Occasions_Gifts_Partner_Agreement.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast({ title: "Error", description: "Could not generate PDF", variant: "destructive" });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSubmitApplication = async () => {
    console.log("=== PARTNER STORE APPLICATION SUBMIT ===");
    console.log("Current Form State:", formData);
    
    // Fallback to UI fields if requested fields are undefined in state
    const company_name = formData.business_name ? formData.business_name.trim() : (formData.storeName ? formData.storeName.trim() : '');
    const contact_email = formData.email ? formData.email.trim() : '';

    if (!contact_email) {
      toast({ title: "Error", description: "Email is required.", variant: "destructive" });
      return;
    }
    if (!company_name) {
      toast({ title: "Error", description: "Business Name (Store Name) is required.", variant: "destructive" });
      return;
    }
    if (!formData.agreeTerms) {
      toast({ title: "Error", description: "You must accept the terms and agreement.", variant: "destructive" });
      return;
    }
    if (!formData.signatureName) {
      toast({ title: "Error", description: "Please sign the agreement.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const insertPayload = {
      company_name: company_name,
      contact_email: contact_email,
      contact_name: formData.contact_name ? formData.contact_name.trim() : (formData.fullName ? formData.fullName.trim() : null),
      phone: formData.phone ? formData.phone.trim() : null,
      website: formData.website ? formData.website.trim() : null,
      business_type: formData.business_type ? formData.business_type.trim() : (formData.businessType ? formData.businessType.trim() : null),
      country: formData.country ? formData.country.trim() : null,
      city: formData.city ? formData.city.trim() : null,
      address: formData.address ? formData.address.trim() : null,
      products: formData.products ? JSON.stringify(formData.products) : null,
      commission_rate: parseFloat(formData.commission_rate) || 0,
      status: 'inactive'
    };

    console.log("=== INSERT PAYLOAD ===");
    console.log("Payload:", insertPayload);
    Object.keys(insertPayload).forEach(key => {
      console.log(`Payload Key: ${key}, Value:`, insertPayload[key]);
    });

    try {
      const { data: appData, error: appError } = await supabase
        .from('b2b_partners')
        .insert([insertPayload])
        .select();

      console.log("=== SUPABASE RESPONSE ===");
      console.log("Data:", appData);
      console.log("Error:", appError);

      if (appError) {
        console.error("=== INSERT ERROR ===");
        console.error("Error specifics:", {
          code: appError.code,
          message: appError.message,
          details: appError.details,
          hint: appError.hint
        });
        console.error("Full Error Object:", appError);
        
        toast({ 
          title: 'Failed to submit application', 
          description: "Please try again.",
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return;
      }

      if (!appData || appData.length === 0) {
        console.error("=== INSERT ERROR ===");
        console.error("No data returned from insert operation.");
        toast({ 
          title: 'Failed to submit application', 
          description: "Please try again.",
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return;
      }

      console.log("=== INSERT SUCCESS ===");
      console.log("Inserted Record:", appData[0]);

      toast({ 
        title: 'Application submitted successfully',
        description: 'Our team will review your application.'
      });
      
      setItem('partner_application_draft', null);
      
      setTimeout(() => {
        navigate('/partner/success');
        setIsSubmitting(false);
      }, 1500);

    } catch (err) {
      console.error("=== UNEXPECTED ERROR ===", err);
      toast({ 
        title: 'Failed to submit application', 
        description: "Please try again.",
        variant: "destructive" 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
        <div className="mb-8">
           <div className="page-logo-container">
             <Logo width="120px" href="/" />
           </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2 text-center">{t('onbTitle')}</h1>
          <p className="text-slate-400 text-center">{t('onbStep', { current: step, total: totalSteps })}</p>
        </div>

        <div className="w-full bg-slate-800 h-2 mb-8 rounded-full overflow-hidden">
          <Progress value={(step / totalSteps) * 100} className="h-full bg-slate-800" />
        </div>

        <div className="bg-[#0f1a2e] border border-slate-700 rounded-xl p-6 md:p-8 shadow-xl">
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">{t('onbStep1Title')}</h2>
              <div className="space-y-2">
                <Label className="text-white">{t('lblFullName')}</Label>
                <Input value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" placeholder={t('phFullName')} />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('lblEmail')}</Label>
                <Input value={formData.email} onChange={(e) => updateField('email', e.target.value)} type="email" className="bg-[#1a2a4a] text-white border-slate-700" placeholder={t('phEmail')} disabled={!!currentUser} />
              </div>
              {!currentUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label className="text-white">{t('lblPassword')}</Label>
                      <Input value={formData.password} onChange={(e) => updateField('password', e.target.value)} type="password" className="bg-[#1a2a4a] text-white border-slate-700" />
                  </div>
                  <div className="space-y-2">
                      <Label className="text-white">{t('lblConfirmPassword')}</Label>
                      <Input value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} type="password" className="bg-[#1a2a4a] text-white border-slate-700" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-white">{t('lblPhone')}</Label>
                <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" placeholder={t('phPhone')} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">{t('onbStep2Title')}</h2>
              <div className="space-y-2">
                <Label className="text-white">{t('lblStoreName')}</Label>
                <Input value={formData.storeName} onChange={(e) => updateField('storeName', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="text-white">{t('lblBusinessType')}</Label>
                   <Select onValueChange={(v) => updateField('businessType', v)} value={formData.businessType}>
                     <SelectTrigger className="bg-[#1a2a4a] text-white border-slate-700"><SelectValue placeholder="Select type" /></SelectTrigger>
                     <SelectContent>
                       {[{ val: 'Florist', lbl: 'optFlorist' }, { val: 'Gift Shop', lbl: 'optGiftShop' }, { val: 'Jewelry', lbl: 'optJewelry' }, { val: 'Beauty', lbl: 'optBeauty' }, { val: 'Sweets', lbl: 'optSweets' }, { val: 'Artisan', lbl: 'optArtisan' }].map(type => <SelectItem key={type.val} value={type.val}>{t(type.lbl)}</SelectItem>)}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-white">{t('lblCountry')}</Label>
                   <Select onValueChange={(v) => updateField('country', v)} value={formData.country}>
                     <SelectTrigger className="bg-[#1a2a4a] text-white border-slate-700"><SelectValue placeholder="Select country" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Albania">Albania</SelectItem>
                       <SelectItem value="Kosovo">Kosovo</SelectItem>
                       <SelectItem value="North Macedonia">North Macedonia</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
              </div>
              <div className="space-y-2">
                 <Label className="text-white">{t('lblCity')}</Label>
                 <Select onValueChange={(v) => updateField('city', v)} value={formData.city}>
                   <SelectTrigger className="bg-[#1a2a4a] text-white border-slate-700"><SelectValue placeholder="Select city" /></SelectTrigger>
                   <SelectContent>
                     {['Tirana', 'Durrës', 'Vlorë', 'Pristina', 'Prizren', 'Peja', 'Skopje', 'Tetovo', 'Gostivar', 'Struga', 'Dibër'].map(c => (
                       <SelectItem key={c} value={c}>{c}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('lblAddress')}</Label>
                <Textarea value={formData.address} onChange={(e) => updateField('address', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">{t('onbStep3Title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">{t('lblRadius')}</Label>
                  <Input type="number" value={formData.radius} onChange={(e) => updateField('radius', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('lblDeliveryFee')}</Label>
                  <Input type="number" value={formData.deliveryFee} onChange={(e) => updateField('deliveryFee', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" />
                </div>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Checkbox id="sameday" checked={formData.sameDay} onCheckedChange={(c) => updateField('sameDay', c)} className="border-slate-500 data-[state=checked]:bg-[#d4af37] data-[state=checked]:text-black" />
                <Label htmlFor="sameday" className="text-white cursor-pointer">{t('lblSameDay')}</Label>
              </div>
              {formData.sameDay && (
                <div className="space-y-2">
                   <Label className="text-white">{t('lblCutoff')}</Label>
                   <Input type="time" value={formData.cutoffTime} onChange={(e) => updateField('cutoffTime', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">{t('onbStep4Title')}</h2>
                <p className="text-slate-400 text-sm mt-1">{t('poStep3Desc')}</p>
              </div>
              
              <ProductList 
                products={formData.products} 
                onProductChange={(products) => updateField('products', products)} 
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">{t('onbStep5Title')}</h2>
              <div className="space-y-2">
                <Label className="text-white">{t('lblAccountHolder')}</Label>
                <Input value={formData.accountHolder} onChange={(e) => updateField('accountHolder', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('lblIban')}</Label>
                <Input value={formData.iban} onChange={(e) => updateField('iban', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700 font-mono" placeholder={t('phIban')} />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('lblBankName')}</Label>
                <Input value={formData.bankName} onChange={(e) => updateField('bankName', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" />
              </div>
              <div className="bg-[#1a2a4a] p-4 rounded-lg space-y-3 mt-4">
                 <div className="flex items-start space-x-2">
                   <Checkbox id="comm" checked={formData.agreeCommission} onCheckedChange={(c) => updateField('agreeCommission', c)} className="mt-1 border-slate-500 data-[state=checked]:bg-[#d4af37]" />
                   <Label htmlFor="comm" className="text-sm text-slate-300 leading-tight">{t('chkCommission')}</Label>
                 </div>
                 <div className="flex items-start space-x-2">
                   <Checkbox id="pay" checked={formData.agreePayout} onCheckedChange={(c) => updateField('agreePayout', c)} className="mt-1 border-slate-500 data-[state=checked]:bg-[#d4af37]" />
                   <Label htmlFor="pay" className="text-sm text-slate-300 leading-tight">{t('chkPayout')}</Label>
                 </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">{t('onbStep6Title')}</h2>
              <div className="bg-[#1a2a4a] p-4 rounded-lg text-sm text-slate-300 h-40 overflow-y-auto border border-slate-700 mb-4">
                <p className="mb-2"><strong>{t('pcSect1Title')}</strong>: {t('pcSect1Text')}</p>
                <p className="mb-2"><strong>{t('pcSect6Title')}</strong>: {t('pcSect6Text1')}</p>
                <p><a href="/partner/contract" target="_blank" className="text-[#d4af37] underline">{t('poBtnContract')}</a>.</p>
              </div>
              <div className="flex justify-end mb-4">
                <Button variant="ghost" size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPdf || isSubmitting} className="text-[#d4af37] hover:text-white hover:bg-slate-800">
                  {isGeneratingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Download className="w-4 h-4 mr-2" />}
                  Download Copy
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                   <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={(c) => updateField('agreeTerms', c)} className="border-slate-500 data-[state=checked]:bg-[#d4af37]" />
                   <Label htmlFor="terms" className="text-white">{t('chkTerms')}</Label>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">{t('lblSignature')}</Label>
                  <Input value={formData.signatureName} onChange={(e) => updateField('signatureName', e.target.value)} className="bg-[#1a2a4a] text-white border-slate-700" placeholder={t('phSignature')} />
                  <p className="text-xs text-slate-500">Signed on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            <Button 
              onClick={prevStep} 
              disabled={step === 1 || isSubmitting}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> {t('onbPrev')}
            </Button>
            
            {step < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={isSubmitting}
                className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-bold"
              >
                {t('onbNext')} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="bg-[#d4af37] text-[#1a2a4a] hover:bg-white font-bold px-8"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t('onbSubmit')} {isSubmitting ? '' : <Check className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartnerOnboarding;