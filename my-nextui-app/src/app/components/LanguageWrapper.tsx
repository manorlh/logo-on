'use client';

import { useLanguage } from '../LanguageContext';

interface LanguageWrapperProps {
  children: React.ReactNode;
}

export function LanguageWrapper({ children }: LanguageWrapperProps) {
  const { language } = useLanguage();
  
  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
} 