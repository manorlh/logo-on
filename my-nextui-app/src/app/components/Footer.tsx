'use client';

import Link from 'next/link';
import { useLanguage } from '../LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t mt-8 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <Link href="/terms" className="hover:underline">
            {t.footer.terms}
          </Link>
          <Link href="/privacy" className="hover:underline">
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