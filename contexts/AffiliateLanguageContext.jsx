import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    heroTitle: "Become an Affiliate",
    heroSubtitle: "Join our affiliate program and earn 20% commission on every sale you refer.",
    applyNow: "Apply Now",
    howItWorks: "How It Works",
    step1Title: "Sign Up",
    step1Desc: "Fill out our simple application form to get started.",
    step2Title: "Share",
    step2Desc: "Share your unique affiliate link with your audience.",
    step3Title: "Earn",
    step3Desc: "Earn 20% commission on every successful referral.",
    benefitsTitle: "Program Benefits",
    benefits: [
      "20% Base Commission",
      "30-Day Cookie Duration",
      "Monthly Payouts",
      "Dedicated Support",
      "Real-time Dashboard",
      "Exclusive Promotions"
    ],
    reqTitle: "Requirements",
    reqDesc: "Active website or social media presence with engaged audience.",
    testimonialsTitle: "What Our Affiliates Say",
    testimonials: [
      { name: "Sarah J.", text: "The best affiliate program I've joined!" },
      { name: "Mike T.", text: "Great commissions and awesome support." },
      { name: "Anna K.", text: "Highly recommend to any content creator." }
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "How much does it cost?", a: "It is completely free to join." },
      { q: "When do I get paid?", a: "Payments are processed monthly via PayPal or Bank Transfer." },
      { q: "Do I need a website?", a: "No, active social media accounts are also accepted." },
      { q: "How are referrals tracked?", a: "We use a 30-day cookie to track your referrals." },
      { q: "Can I refer myself?", a: "No, self-referrals are not eligible for commission." }
    ],
    formPersonal: "Personal Information",
    formWebsite: "Website / Business",
    formMarketing: "Marketing Channels",
    formTerms: "Terms & Conditions",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    websiteName: "Website/Business Name",
    websiteUrl: "Website URL",
    businessType: "Business Type",
    monthlyVisitors: "Monthly Visitors",
    marketingChannels: "Where do you promote?",
    emailChannel: "Email Newsletter",
    socialChannel: "Social Media",
    blogChannel: "Blog/Website",
    youtubeChannel: "YouTube",
    podcastChannel: "Podcast",
    influencerChannel: "Influencer",
    agreeTerms: "I agree to the Terms & Conditions",
    agreePrivacy: "I agree to the Privacy Policy",
    next: "Next",
    previous: "Previous",
    submit: "Submit Application",
    step: "Step",
    successMessage: "Application Submitted Successfully!",
    nextSteps: "Next Steps",
    ns1: "We will review your application within 2-3 business days.",
    ns2: "Check your email for confirmation.",
    ns3: "Once approved, you'll receive access to your dashboard.",
    ns4: "Start sharing and earning!",
    backToProgram: "Back to Program",
    backToHome: "Back to Home",
    validationRequired: "This field is required",
    validationEmail: "Invalid email address",
    validationTerms: "You must agree to continue"
  },
  sq: {
    heroTitle: "Bëhu një Filial",
    heroSubtitle: "Bashkohuni me programin tonë dhe fitoni 20% komision për çdo shitje.",
    applyNow: "Apliko Tani",
    howItWorks: "Si Funksionon",
    step1Title: "Regjistrohu",
    step1Desc: "Plotëso formularin tonë të thjeshtë për të filluar.",
    step2Title: "Ndaj",
    step2Desc: "Ndaj lidhjen tënde unike me audiencën tënde.",
    step3Title: "Fito",
    step3Desc: "Fito 20% komision për çdo referim të suksesshëm.",
    benefitsTitle: "Përfitimet e Programit",
    benefits: [
      "20% Komision Bazë",
      "Kohëzgjatja 30-ditore e Cookie",
      "Pagesa Mujore",
      "Mbështetje e Dedikuar",
      "Pult në Kohë Reale",
      "Promocione Ekskluzive"
    ],
    reqTitle: "Kërkesat",
    reqDesc: "Uebsajt aktiv ose prani në rrjetet sociale me audiencë të angazhuar.",
    testimonialsTitle: "Çfarë thonë Filialët tanë",
    testimonials: [
      { name: "Sarah J.", text: "Programi më i mirë i filialeve që i jam bashkuar!" },
      { name: "Mike T.", text: "Komisione të shkëlqyera dhe mbështetje e jashtëzakonshme." },
      { name: "Anna K.", text: "Rekomandoj shumë për çdo krijues përmbajtjeje." }
    ],
    faqTitle: "Pyetjet më të Shpeshta",
    faqs: [
      { q: "Sa kushton?", a: "Është plotësisht falas për t'u bashkuar." },
      { q: "Kur paguhem?", a: "Pagesat përpunohen çdo muaj." },
      { q: "A më duhet një uebsajt?", a: "Jo, llogaritë aktive sociale pranohen gjithashtu." },
      { q: "Si gjurmohen referimet?", a: "Ne përdorim një cookie 30-ditore." },
      { q: "A mund të referoj veten?", a: "Jo, vetë-referimet nuk kualifikohen." }
    ],
    formPersonal: "Informatat Personale",
    formWebsite: "Uebsajt / Biznes",
    formMarketing: "Kanalet e Marketingut",
    formTerms: "Kushtet dhe Afatet",
    firstName: "Emri",
    lastName: "Mbiemri",
    email: "Adresa e Email-it",
    phone: "Numri i Telefonit",
    websiteName: "Emri i Uebsajtit/Biznesit",
    websiteUrl: "URL e Uebsajtit",
    businessType: "Lloji i Biznesit",
    monthlyVisitors: "Vizitorët Mujorë",
    marketingChannels: "Ku promovoni?",
    emailChannel: "Email Newsletter",
    socialChannel: "Rrjetet Sociale",
    blogChannel: "Blog/Uebsajt",
    youtubeChannel: "YouTube",
    podcastChannel: "Podcast",
    influencerChannel: "Influencues",
    agreeTerms: "Pajtohem me Kushtet dhe Afatet",
    agreePrivacy: "Pajtohem me Politikën e Privatësisë",
    next: "Tjetra",
    previous: "Kthehu",
    submit: "Dërgo Aplikimin",
    step: "Hapi",
    successMessage: "Aplikimi u Dërgua me Sukses!",
    nextSteps: "Hapat e Rradhës",
    ns1: "Ne do të rishikojmë aplikimin tuaj brenda 2-3 ditëve pune.",
    ns2: "Kontrolloni emailin tuaj për konfirmim.",
    ns3: "Pasi të miratoheni, do të keni akses në pultin tuaj.",
    ns4: "Fillo të ndash dhe të fitosh!",
    backToProgram: "Kthehu tek Programi",
    backToHome: "Kthehu në Kryefaqe",
    validationRequired: "Kjo fushë është e detyrueshme",
    validationEmail: "Email i pavlefshëm",
    validationTerms: "Duhet të pajtoheni për të vazhduar"
  },
  mk: {
    heroTitle: "Станете Афилијат",
    heroSubtitle: "Придружете се на нашата афилијат програма и заработете 20% провизија.",
    applyNow: "Аплицирај Сега",
    howItWorks: "Како Работи",
    step1Title: "Регистрирај се",
    step1Desc: "Пополнете го нашиот формулар за да започнете.",
    step2Title: "Сподели",
    step2Desc: "Споделете го вашиот уникатен линк со вашата публика.",
    step3Title: "Заработи",
    step3Desc: "Заработете 20% провизија за секоја успешна препорака.",
    benefitsTitle: "Придобивки",
    benefits: [
      "20% Основна Провизија",
      "30-Дневно Колаче",
      "Месечни Исплати",
      "Посветена Поддршка",
      "Контролна Табла во Реално Време",
      "Ексклузивни Промоции"
    ],
    reqTitle: "Барања",
    reqDesc: "Активна веб-страница или социјални медиуми со ангажирана публика.",
    testimonialsTitle: "Што велат нашите Афилијати",
    testimonials: [
      { name: "Sarah J.", text: "Најдобрата програма на која сум се придружил!" },
      { name: "Mike T.", text: "Одлични провизии и супер поддршка." },
      { name: "Anna K.", text: "Топло препорачувам на секој креатор." }
    ],
    faqTitle: "Често Поставувани Прашања",
    faqs: [
      { q: "Колку чини?", a: "Целосно е бесплатно." },
      { q: "Кога добивам исплата?", a: "Исплатите се процесираат месечно." },
      { q: "Дали ми треба веб-страница?", a: "Не, се прифаќаат и активни социјални медиуми." },
      { q: "Како се следат препораките?", a: "Користиме 30-дневно колаче." },
      { q: "Може ли да се препорачам самиот?", a: "Не, тоа не е дозволено." }
    ],
    formPersonal: "Лични Информации",
    formWebsite: "Веб-страница / Бизнис",
    formMarketing: "Маркетинг Канали",
    formTerms: "Услови и Правила",
    firstName: "Име",
    lastName: "Презиме",
    email: "Емаил Адреса",
    phone: "Телефонски Број",
    websiteName: "Име на Веб-страница",
    websiteUrl: "URL на Веб-страница",
    businessType: "Тип на Бизнис",
    monthlyVisitors: "Месечни Посетители",
    marketingChannels: "Каде промовирате?",
    emailChannel: "Емаил Билтен",
    socialChannel: "Социјални Медиуми",
    blogChannel: "Блог/Веб-страница",
    youtubeChannel: "YouTube",
    podcastChannel: "Подкаст",
    influencerChannel: "Инфлуенсер",
    agreeTerms: "Се согласувам со Условите",
    agreePrivacy: "Се согласувам со Политиката за Приватност",
    next: "Следно",
    previous: "Назад",
    submit: "Испрати Апликација",
    step: "Чекор",
    successMessage: "Апликацијата е Успешно Испратена!",
    nextSteps: "Следни Чекори",
    ns1: "Ќе ја разгледаме вашата апликација во рок од 2-3 работни дена.",
    ns2: "Проверете го вашиот емаил за потврда.",
    ns3: "Откако ќе бидете одобрени, ќе добиете пристап до вашата табла.",
    ns4: "Започнете со споделување и заработка!",
    backToProgram: "Назад кон Програмата",
    backToHome: "Назад кон Дома",
    validationRequired: "Ова поле е задолжително",
    validationEmail: "Невалидна емаил адреса",
    validationTerms: "Мора да се согласите за да продолжите"
  }
};

const AffiliateLanguageContext = createContext();

export const AffiliateLanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('affiliate_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('affiliate_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  return (
    <AffiliateLanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </AffiliateLanguageContext.Provider>
  );
};

export const useAffiliateLanguage = () => {
  const context = useContext(AffiliateLanguageContext);
  if (!context) {
    throw new Error('useAffiliateLanguage must be used within an AffiliateLanguageProvider');
  }
  return context;
};