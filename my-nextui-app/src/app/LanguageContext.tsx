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
  t: any; // Using any to avoid type issues with translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLanguage 
}: { 
  children: React.ReactNode; 
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage || 'he');
  const [currency, setCurrency] = useState<Currency>(initialLanguage === 'he' ? 'ILS' : 'USD');

  useEffect(() => {
    if (!initialLanguage) {
      const savedLang = Cookies.get('NEXT_LOCALE');
      if (savedLang === 'en' || savedLang === 'he' || savedLang === 'ar') {
        setLanguage(savedLang as Language);
        setCurrency(savedLang === 'he' ? 'ILS' : 'USD');
      }
    } else {
      // If initialLanguage is provided, update the cookie to match
      Cookies.set('NEXT_LOCALE', initialLanguage, { expires: 365 });
    }
  }, [initialLanguage]);

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