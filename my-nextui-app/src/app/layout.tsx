import { Providers } from "./providers";
import { Inter } from 'next/font/google';
import './globals.css';
import { CustomToaster } from './components/CustomToaster';
import { Logo } from './components/Logo';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSelect } from './components/LanguageSelect';
import JsonLd from './components/JsonLd';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { Footer } from './components/Footer';
import { Favicon } from './components/Favicon';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'הוספת לוגו לתמונות | YourLogoHere.app',
    template: '%s | YourLogoHere.app'
  },
  description: 'כלי חינמי להוספת לוגו למספר תמונות בו זמנית. הוסף את הלוגו שלך בקלות ובמהירות לכל התמונות שלך',
  keywords: [
    'הוספת לוגו',
    'עיבוד תמונות',
    'ווטרמרק',
    'לוגו לתמונות',
    'עיצוב לוגו',
    'עריכת תמונות',
    'כלי עיצוב',
    'עיצוב גרפי',
    'watermark',
    'logo placement',
    'image processing'
  ],
  authors: [{ name: 'YourLogoHere.app' }],
  creator: 'YourLogoHere.app',
  publisher: 'YourLogoHere.app',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourlogohere.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'he-IL': '/he',
    },
  },
  openGraph: {
    title: 'הוספת לוגו לתמונות | YourLogoHere.app',
    description: 'כלי חינמי להוספת לוגו למספר תמונות בו זמנית. הוסף את הלוגו שלך בקלות ובמהירות לכל התמונות שלך',
    url: 'https://yourlogohere.app',
    siteName: 'YourLogoHere.app',
    images: [
      {
        url: 'https://yourlogohere.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YourLogoHere.app - הוספת לוגו לתמונות',
      },
    ],
    locale: 'he_IL',
    type: 'website',
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
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <JsonLd />
        <Providers>
          <header className="border-b dark:border-gray-800">
            <div className="container mx-auto p-4">
              <div className="flex justify-between items-center">
                <Logo />
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <LanguageSelect />
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
        </Providers>
      </body>
    </html>
  );
}
