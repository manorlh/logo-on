import { LanguageProvider } from '../LanguageContext';

export function LanguageWrapper({ lang, children }: { lang: string; children: React.ReactNode }) {
  // This is a server component that passes the language from the URL to client components
  return (
    <LanguageProvider initialLanguage={lang}>
      {children}
    </LanguageProvider>
  );
} 