'use client';

import Link from 'next/link';
import { useLanguage } from '../LanguageContext';
import { usePathname } from 'next/navigation';

export function Footer() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  
  // Check if we're in a language-prefixed route
  const pathParts = pathname.split('/').filter(Boolean);
  const currentLang = pathParts[0] === 'en' || pathParts[0] === 'he' || pathParts[0] === 'ar' 
    ? pathParts[0] 
    : language;
  
  // Create links with the current language prefix
  const termsLink = `/${currentLang}/terms`;
  const privacyLink = `/${currentLang}/privacy`;
  
  return (
    <footer className="border-t mt-8 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <Link href={termsLink} className="hover:underline">
            {t.footer.terms}
          </Link>
          <Link href={privacyLink} className="hover:underline">
            {t.footer.privacy}
          </Link>
          <span>{t.footer.rights}</span>
        </div>
        <div className="flex justify-center items-center mt-2 text-sm text-gray-600">
          <span>{t.footer.paypal}</span>
        </div>
      </div>
    </footer>
  );
} 