'use client';

import { Toaster } from 'sonner';
import { useLanguage } from '../LanguageContext';

export function CustomToaster() {
  const { language } = useLanguage();
  const isRTL = language === 'he' || language === 'ar';

  return (
    <Toaster 
      position={isRTL ? "bottom-left" : "bottom-right"}
      dir={isRTL ? "rtl" : "ltr"}
      className={isRTL ? "rtl-toaster" : ""}
      closeButton
      richColors
      expand={false}
      toastOptions={{
        style: {
          direction: isRTL ? "rtl" : "ltr",
          textAlign: isRTL ? "right" : "left",
          writingMode: "horizontal-tb"
        }
      }}
    />
  );
} 