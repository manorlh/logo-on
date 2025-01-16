'use client';

import { useLanguage } from '../LanguageContext';

interface LanguageWrapperProps {
  children: React.ReactNode;
}

export function LanguageWrapper({ children }: LanguageWrapperProps) {
  const { language } = useLanguage();
  const isRTL = language === 'he' || language === 'ar';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
} 