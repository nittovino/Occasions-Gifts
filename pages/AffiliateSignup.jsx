import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAffiliateLanguage } from '@/contexts/AffiliateLanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const AffiliateSignup = () => {
  const { t } = useAffiliateLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    websiteName: '',
    website: '',
    business_type: '',
    monthly_traffic: '',
    channels: {
      email: false,
      social: false,
      blog: false,
      youtube: false,
      podcast: false,
      influencer: false
    },
    agreeTerms: false,
    agreePrivacy: false
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.first_name) newErrors.first_name = t('validationRequired');
      if (!formData.last_name) newErrors.last_name = t('validationRequired');
      if (!formData.email) {
        newErrors.email = t('validationRequired');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('validationEmail');
      }
    }
    if (currentStep === 2) {
      if (!formData.websiteName) newErrors.websiteName = t('validationRequired');
      if (!formData.website) newErrors.website = t('validationRequired');
      if (!formData.business_type) newErrors.business_type = t('validationRequired');
    }
    if (currentStep === 4) {
      if (!formData.agreeTerms) newErrors.agreeTerms = t('validationTerms');
      if (!formData.agreePrivacy) newErrors.agreePrivacy = t('validationTerms');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Please fix the errors before continuing." });
    }
  };

  const handlePrev = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleChannelToggle = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: { ...prev.channels, [channel]: !prev.channels[channel] }
    }));
  };

  const handleSubmit = async () => {
    console.log("AFFILIATE SIGNUP SUBMIT - Starting submission process");
    
    if (!validateStep(4)) {
      toast({ variant: "destructive", title: "Error", description: "Please agree to the terms." });
      return;
    }
    
    const emailStr = formData.email ? formData.email.trim() : '';
    const firstNameStr = formData.first_name ? formData.first_name.trim() : '';
    
    if (!emailStr) {
      toast({ variant: "destructive", title: "Error", description: "Email is required." });
      return;
    }
    if (!firstNameStr) {
      toast({ variant: "destructive", title: "Error", description: "First name is required." });
      return;
    }

    setLoading(true);

    const insertPayload = {
      first_name: firstNameStr,
      last_name: formData.last_name ? formData.last_name.trim() : '',
      email: emailStr,
      phone: formData.phone ? formData.phone.trim() : '',
      website: formData.website ? formData.website.trim() : '',
      business_type: formData.business_type ? formData.business_type.trim() : '',
      monthly_traffic: formData.monthly_traffic ? formData.monthly_traffic.trim() : '',
      status: 'pending',
      notes: JSON.stringify({
        websiteName: formData.websiteName ? formData.websiteName.trim() : '',
        channels: formData.channels
      })
    };

    console.log("INSERT PAYLOAD: ", insertPayload);
    console.log("Email field checks - is null?:", insertPayload.email === null, "| is undefined?:", insertPayload.email === undefined, "| is empty string?:", insertPayload.email === '', "| length:", insertPayload.email.length);

    if (!insertPayload.email) {
      console.error("INSERT ERROR: Email is missing in payload just before insert.");
      toast({ variant: "destructive", title: "System Error", description: "Critical data missing. Please try again." });
      setLoading(false);
      return;
    }

    try {
      const { data: insertedData, error } = await supabase
        .from('affiliate_applications')
        .insert([insertPayload])
        .select();
      
      if (error) {
        console.error("INSERT ERROR:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        toast({ 
          variant: "destructive", 
          title: "Submission Failed", 
          description: error.message || "Could not save your application." 
        });
        setLoading(false);
        return; 
      }

      if (!insertedData || insertedData.length === 0) {
        console.error("INSERT ERROR: No data returned from insert (appData.length is 0).");
        toast({ 
          variant: "destructive", 
          title: "Submission Failed", 
          description: "Could not verify that your application was saved." 
        });
        setLoading(false);
        return;
      }
      
      console.log("INSERT SUCCESS: Application inserted successfully", insertedData);
      
      toast({ 
        title: "Success!", 
        description: "Application submitted successfully! Check your email for confirmation." 
      });
      
      console.log("SUBMISSION COMPLETE - Triggering background email functions...");

      supabase.functions.invoke('send-affiliate-email', {
        body: {
          type: 'applicant',
          email: insertPayload.email,
          firstName: insertPayload.first_name,
          subject: 'Affiliate Application Received - Occasions Gifts'
        }
      }).then((response) => {
        console.log("Applicant Email Edge Function Response:", response);
      }).catch((err) => {
        console.error("Applicant Email Edge Function Failed:", err);
      });

      supabase.functions.invoke('send-affiliate-email', {
        body: {
          type: 'admin',
          email: 'admin@occasions-gifts.com',
          applicantName: `${insertPayload.first_name} ${insertPayload.last_name}`.trim(),
          applicantEmail: insertPayload.email,
          applicantPhone: insertPayload.phone,
          applicantWebsite: insertPayload.website,
          applicantBusinessType: insertPayload.business_type,
          applicantMonthlyTraffic: insertPayload.monthly_traffic,
          subject: 'New Affiliate Application Submitted'
        }
      }).then((response) => {
        console.log("Admin Email Edge Function Response:", response);
      }).catch((err) => {
        console.error("Admin Email Edge Function Failed:", err);
      });

      setFormData(initialFormState);
      setStep(1);

      navigate('/affiliate-confirmation');
      
    } catch (err) {
      console.error("UNEXPECTED ERROR during submission:", err);
      toast({ variant: "destructive", title: "Submission Failed", description: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a2a4a]">
      <Helmet><title>Occasions Gifts - {t('heroTitle')}</title></Helmet>
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-white">{t('heroTitle')}</h1>
            <LanguageSwitcher />
          </div>

          <div className="mb-8 flex justify-between items-center text-sm font-medium text-slate-400">
            {[1,2,3,4].map(num => (
              <div key={num} className={`flex items-center ${step >= num ? 'text-[#d4af37]' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= num ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-slate-600'}`}>
                  {num}
                </div>
                {num < 4 && <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > num ? 'bg-[#d4af37]' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          <Card className="bg-[#0f1a2e] border-slate-700 text-white shadow-2xl">
            <CardContent className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-[#d4af37] mb-6">{t('formPersonal')}</h2>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>{t('firstName')} *</Label>
                          <Input className="bg-[#1a2a4a] text-white" value={formData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} />
                          {errors.first_name && <span className="text-red-400 text-xs">{errors.first_name}</span>}
                        </div>
                        <div className="space-y-2">
                          <Label>{t('lastName')} *</Label>
                          <Input className="bg-[#1a2a4a] text-white" value={formData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} />
                          {errors.last_name && <span className="text-red-400 text-xs">{errors.last_name}</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('email')} *</Label>
                        <Input type="email" className="bg-[#1a2a4a] text-white" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                        {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label>{t('phone')}</Label>
                        <Input type="tel" className="bg-[#1a2a4a] text-white" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-[#d4af37] mb-6">{t('formWebsite')}</h2>
                      <div className="space-y-2">
                        <Label>{t('websiteName')} *</Label>
                        <Input className="bg-[#1a2a4a] text-white" value={formData.websiteName} onChange={(e) => handleChange('websiteName', e.target.value)} />
                        {errors.websiteName && <span className="text-red-400 text-xs">{errors.websiteName}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label>{t('websiteUrl')} *</Label>
                        <Input type="url" className="bg-[#1a2a4a] text-white" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} />
                        {errors.website && <span className="text-red-400 text-xs">{errors.website}</span>}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>{t('businessType')} *</Label>
                          <Input className="bg-[#1a2a4a] text-white" value={formData.business_type} onChange={(e) => handleChange('business_type', e.target.value)} />
                          {errors.business_type && <span className="text-red-400 text-xs">{errors.business_type}</span>}
                        </div>
                        <div className="space-y-2">
                          <Label>{t('monthlyVisitors')}</Label>
                          <Input className="bg-[#1a2a4a] text-white" value={formData.monthly_traffic} onChange={(e) => handleChange('monthly_traffic', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-[#d4af37] mb-6">{t('formMarketing')}</h2>
                      <Label className="block mb-4 text-slate-300">{t('marketingChannels')}</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { id: 'email', label: t('emailChannel') },
                          { id: 'social', label: t('socialChannel') },
                          { id: 'blog', label: t('blogChannel') },
                          { id: 'youtube', label: t('youtubeChannel') },
                          { id: 'podcast', label: t('podcastChannel') },
                          { id: 'influencer', label: t('influencerChannel') },
                        ].map(ch => (
                          <div key={ch.id} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-700 bg-[#1a2a4a]">
                            <Checkbox 
                              id={`ch-${ch.id}`} 
                              checked={formData.channels[ch.id]}
                              onCheckedChange={() => handleChannelToggle(ch.id)}
                            />
                            <Label htmlFor={`ch-${ch.id}`} className="cursor-pointer flex-1">{ch.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-[#d4af37] mb-6">{t('formTerms')}</h2>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="terms" 
                            checked={formData.agreeTerms}
                            onCheckedChange={(val) => handleChange('agreeTerms', val)}
                            className="mt-1"
                          />
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="terms" className="cursor-pointer">{t('agreeTerms')} *</Label>
                            {errors.agreeTerms && <p className="text-red-400 text-xs mt-1">{errors.agreeTerms}</p>}
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="privacy" 
                            checked={formData.agreePrivacy}
                            onCheckedChange={(val) => handleChange('agreePrivacy', val)}
                            className="mt-1"
                          />
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="privacy" className="cursor-pointer">{t('agreePrivacy')} *</Label>
                            {errors.agreePrivacy && <p className="text-red-400 text-xs mt-1">{errors.agreePrivacy}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-10 pt-6 border-t border-slate-800">
                <Button 
                  variant="outline" 
                  onClick={handlePrev} 
                  disabled={step === 1 || loading}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> {t('previous')}
                </Button>
                
                {step < 4 ? (
                  <Button onClick={handleNext} className="bg-[#d4af37] text-[#1a2a4a] hover:bg-[#c19a2f] font-bold">
                    {t('next')} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="bg-[#d4af37] text-[#1a2a4a] hover:bg-[#c19a2f] font-bold">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {t('submit')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AffiliateSignup;