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
import { CurrencySelect } from './components/CurrencySelect';
import { LanguageWrapper } from './components/LanguageWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://yourlogohere.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'he': '/he',
    },
  },
  'en': {
    title: {
      default: 'YourLogoHere.app | Add Logo to Images',
      template: '%s | YourLogoHere.app'
    },
    description: 'Free tool to add your logo to multiple images at once. Easily and quickly add your logo to all your images',
    keywords: [
      'add logo to images',
      'add logo',
      'image processing',
      'watermark',
      'logo placement',
      'logo design',
      'image editing',
      'design tools',
      'graphic design',
      'batch processing',
      'image branding',
      'real estate marketing',
      'real estate agent tools',
      'property listing images',
      'real estate branding',
      'realtor tools'
    ],
    openGraph: {
      title: 'Add Logo to Images | YourLogoHere.app',
      description: 'Free tool to add your logo to multiple images at once',
      locale: 'en_US',
    }
  },
  'he': {
    title: {
      default: 'YourLogoHere.app | הוספת לוגו לתמונות',
      template: '%s | YourLogoHere.app'
    },
    description: 'כלי חינמי להוספת לוגו למספר תמונות בו זמנית. הוסף את הלוגו שלך בקלות ובמהירות לכל התמונות שלך',
    keywords: [ 
      'הדבקת לוגו',
      'הוספת לוגו',
      'עיבוד תמונות',
      'ווטרמרק',
      'לוגו לתמונות',
      'עיצוב לוגו',
      'עריכת תמונות',
      'כלי עיצוב',
      'עיצוב גרפי',
      'כלי למתווכים',
      'כלים למשרדי תיווך',
      'עיצוב תמונות לנכסים',
      'מיתוג למתווכים',
      'עיבוד תמונות לנדלן',
      'כלי שיווק לנדלן',
      'מיתוג משרד תיווך'
    ],
    openGraph: {
      title: 'הוספת לוגו לתמונות | YourLogoHere.app',
      description: 'כלי חינמי להוספת לוגו למספר תמונות בו זמנית',
      locale: 'he_IL',
    }
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5'
      }
    ]
  },
  manifest: '/manifest.json',
};

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
          </LanguageWrapper>
        </Providers>
      </body>
    </html>
  );
}
