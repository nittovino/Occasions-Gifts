import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import al from '@/locales/al.json';
import mk from '@/locales/mk.json';

const resources = {
  en,
  sq: al,
  al,
  mk
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('occasions_gifts_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('occasions_gifts_language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Helper to resolve nested keys (e.g., "section.title")
  const resolvePath = (object, path, defaultValue) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object);
  };

  const t = (key, params = {}) => {
    const currentResources = resources[language] || resources['en'];
    let translation = resolvePath(currentResources, key, null);

    // Fallback to English
    if (!translation) {
      translation = resolvePath(resources['en'], key, key);
      if (import.meta.env.DEV && translation === key) {
        console.warn(`Missing translation: "${key}" (${language})`);
      }
    }

    // If result is an object/array, return it directly (for mapping)
    if (typeof translation === 'object') return translation;

    // Parameter substitution
    if (typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }

    return translation;
  };

  // Allow accessing specific language resources directly
  const getResource = (lang) => resources[lang] || resources['en'];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getResource }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};

export default LanguageContext;