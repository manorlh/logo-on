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

const inter = Inter({ subsets: ['latin'] });

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <JsonLd />
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
