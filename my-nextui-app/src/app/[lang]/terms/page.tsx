'use client';

import { TermsOfUse } from '../../components/TermsOfUse';
import { LanguageSelect } from '../../components/LanguageSelect';
import { CurrencySelect } from '../../components/CurrencySelect';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Logo } from '../../components/Logo';
import { useLanguage } from '../../LanguageContext';

export default function TermsPage({ params }: { params: { lang: string } }) {
  const { t } = useLanguage();
  
  return (
    <>
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
          <h1 className="text-3xl font-bold text-center mt-4">
            {t.title}
          </h1>
        </div>
      </header>
      
      <div className="container mx-auto p-4">
        <TermsOfUse language={params.lang} />
      </div>
    </>
  );
} 