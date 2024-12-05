'use client';

import { NextUIProvider } from '@nextui-org/react';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
} 