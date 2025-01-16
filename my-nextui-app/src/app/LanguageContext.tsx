'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import Cookies from 'js-cookie';

type Language = 'he' | 'en' | 'ar';
type Currency = 'ILS' | 'USD';

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('he');
  const [currency, setCurrency] = useState<Currency>('ILS');

  useEffect(() => {
    const savedLang = Cookies.get('NEXT_LOCALE');
    if (savedLang === 'en' || savedLang === 'he' || savedLang === 'ar') {
      setLanguage(savedLang);
      setCurrency(savedLang === 'he' ? 'ILS' : 'USD');
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCurrency(newLang === 'he' ? 'ILS' : 'USD');
    Cookies.set('NEXT_LOCALE', newLang, { expires: 365 });
  };

  const value = {
    language,
    currency,
    setLanguage: handleLanguageChange,
    setCurrency,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 