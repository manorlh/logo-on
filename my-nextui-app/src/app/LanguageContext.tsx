'use client';

import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

type Language = 'he' | 'en';
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

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCurrency(newLang === 'he' ? 'ILS' : 'USD');
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