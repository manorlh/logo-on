'use client';

import { NextUIProvider } from '@nextui-org/react';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';

interface ProvidersProps {
  children: React.ReactNode;
  withLanguageProvider?: boolean;
}

export function Providers({ children, withLanguageProvider = true }: ProvidersProps) {
  return (
    <ThemeProvider>
      {withLanguageProvider ? (
        <LanguageProvider>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </LanguageProvider>
      ) : (
        <NextUIProvider>
          {children}
        </NextUIProvider>
      )}
    </ThemeProvider>
  );
} 