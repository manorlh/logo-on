'use client';

import { useLanguage } from '../LanguageContext';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelect } from './LanguageSelect';
import { CurrencySelect } from './CurrencySelect';
import { CustomToaster } from './CustomToaster';
import { AccessibilityWidget } from './AccessibilityWidget';
import { Footer } from './Footer';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const isRTL = language === 'he' || language === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LanguageSelect />
                <CurrencySelect />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CustomToaster />
      <AccessibilityWidget />
    </div>
  );
} 