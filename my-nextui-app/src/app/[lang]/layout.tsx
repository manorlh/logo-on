import { Providers } from "../providers";
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  // For Arabic text, we'll use system fonts
  variable: '--font-inter'
});

export default function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: 'en' | 'he' | 'ar' }
}) {
  const isRTL = params.lang === 'he' || params.lang === 'ar';
  
  return (
    <html lang={params.lang} dir={isRTL ? 'rtl' : 'ltr'} className={`dark ${inter.variable}`}>
      <head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="dark:bg-gray-900 dark:text-gray-100 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 