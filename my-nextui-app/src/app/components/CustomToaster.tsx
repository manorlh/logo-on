'use client';

import { Toaster } from 'sonner';
import { useLanguage } from '../LanguageContext';

export function CustomToaster() {
  const { language } = useLanguage();
  const isRTL = language === 'he';

  return (
    <Toaster 
      richColors 
      position="top-center"
      dir={isRTL ? "rtl" : "ltr"}
    //   className={isRTL ? "rtl-toaster" : ""}
    />
  );
} 