import { Providers } from "./providers";
import { Inter } from 'next/font/google';
import './globals.css';
import { CustomToaster } from './components/CustomToaster';
import JsonLd from './components/JsonLd';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { Footer } from './components/Footer';
import { Favicon } from './components/Favicon';
import { LanguageWrapper } from './components/LanguageWrapper';
import { metadata as siteMetadata } from './metadata';
import { headers } from 'next/headers';
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ['latin'] });

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current URL path to determine language
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const lang = pathname.split('/')[1] || 'en'; // Default to 'en' if no language found

  return (
    <html lang={lang} className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <JsonLd />
        <Analytics/>
        <Providers>
          <LanguageWrapper>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CustomToaster />
            <AccessibilityWidget />
          </LanguageWrapper>
        </Providers>
      </body>
    </html>
  );
}
