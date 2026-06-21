import { useContext } from 'react';
import LanguageContext from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { language, setLanguage, t } = useContext(LanguageContext);
  return { t, language, setLanguage };
};