// Re-exporting JSONs to maintain backward compatibility with any file 
// that might still be importing 'translations' directly.
import en from '@/locales/en.json';
import al from '@/locales/al.json';
import mk from '@/locales/mk.json';

export const translations = {
  en,
  sq: al,
  mk
};