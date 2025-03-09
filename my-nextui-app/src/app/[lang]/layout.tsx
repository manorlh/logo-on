import { Metadata } from 'next';
import { Providers } from "../providers";
import { Inter } from 'next/font/google';
import '../globals.css';
import { CustomToaster } from '../components/CustomToaster';
import JsonLd from '../components/JsonLd';
import { AccessibilityWidget } from '../components/AccessibilityWidget';
import { Footer } from '../components/Footer';
import { Analytics } from "@vercel/analytics/react";
import { metadata as siteMetadata } from '../metadata';
import { LanguageWrapper } from './LanguageWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

type LangMetadata = {
  title: { default: string; template: string };
  description: string;
  keywords: string[];
  openGraph: {
    type: string;
    title: string;
    description: string;
    locale: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang as keyof typeof siteMetadata;
  const langMetadata = (siteMetadata[lang] || siteMetadata.en) as LangMetadata;
  
  return {
    metadataBase: siteMetadata.metadataBase,
    title: langMetadata.title.default,
    description: langMetadata.description,
    keywords: langMetadata.keywords,
    openGraph: langMetadata.openGraph,
    twitter: langMetadata.twitter,
    alternates: {
      canonical: `${siteMetadata.metadataBase}/${params.lang}`,
      languages: siteMetadata.alternates.languages
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
    icons: siteMetadata.icons,
    manifest: siteMetadata.manifest,
    verification: siteMetadata.verification
  };
}

export default function LangLayout({ children, params }: Props) {
  const isRTL = params.lang === 'he' || params.lang === 'ar';
  const lang = params.lang as keyof typeof siteMetadata;
  const langMetadata = (siteMetadata[lang] || siteMetadata.en) as LangMetadata;
  
  return (
    <html lang={params.lang} dir={isRTL ? 'rtl' : 'ltr'} className={`${isRTL ? 'rtl' : 'ltr'} ${inter.variable}`}>
      <head>
        {siteMetadata.icons.icon.map((icon, i) => (
          <link key={i} rel="icon" {...icon} />
        ))}
        {siteMetadata.icons.apple.map((icon, i) => (
          <link key={i} rel="apple-touch-icon" {...icon} />
        ))}
        {siteMetadata.icons.other.map((icon, i) => (
          <link key={i} {...icon} />
        ))}
        {isRTL && (
          <>
            <link
              rel="preload"
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
              as="style"
            />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
            />
          </>
        )}
      </head>
      <body className={`dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col ${isRTL ? 'font-arabic' : 'font-sans'}`}>
        <JsonLd />
        <Analytics />
        <Providers withLanguageProvider={false}>
          <LanguageWrapper lang={params.lang}>
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