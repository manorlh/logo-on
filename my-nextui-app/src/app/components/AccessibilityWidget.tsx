'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === 'he' || language === 'ar';
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleWidget = () => setIsOpen(!isOpen);

  const features = {
    increaseFontSize: () => {
      document.body.style.fontSize = 'larger';
    },
    decreaseFontSize: () => {
      document.body.style.fontSize = 'smaller';
    },
    resetFontSize: () => {
      document.body.style.fontSize = 'initial';
    },
    highContrast: () => {
      document.body.classList.toggle('high-contrast');
    },
    grayscale: () => {
      document.body.classList.toggle('grayscale');
    },
    readableFont: () => {
      document.body.classList.toggle('readable-font');
    }
  };

  return (
    <div 
      ref={widgetRef}
      className={`fixed ${isRTL ? 'left-4' : 'right-4'} bottom-4 z-50`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <button
        onClick={toggleWidget}
        className="bg-primary rounded-full p-3 shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Toggle accessibility menu"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="white"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute bottom-16 ${isRTL ? 'left-0' : 'right-0'} bg-background border rounded-lg shadow-xl p-4 w-64`}>
          <div className="space-y-3">
            <h3 className="font-bold text-lg border-b pb-2">
              {isRTL ? 'כלי נגישות' : 'Accessibility Tools'}
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={features.increaseFontSize}
                className="w-full text-left px-3 py-2 hover:bg-default-100 rounded-md"
              >
                {isRTL ? 'הגדל טקסט' : 'Increase Text Size'}
              </button>
              
              <button
                onClick={features.decreaseFontSize}
                className="w-full text-left px-3 py-2 hover:bg-default-100 rounded-md"
              >
                {isRTL ? 'הקטן טקסט' : 'Decrease Text Size'}
              </button>
              
              <button
                onClick={features.resetFontSize}
                className="w-full text-left px-3 py-2 hover:bg-default-100 rounded-md"
              >
                {isRTL ? 'איפוס גודל טקסט' : 'Reset Text Size'}
              </button>
              
              <button
                onClick={features.highContrast}
                className="w-full text-left px-3 py-2 hover:bg-default-100 rounded-md"
              >
                {isRTL ? 'ניגודיות גבוהה' : 'High Contrast'}
              </button>
              
              <button
                onClick={features.grayscale}
                className="w-full text-left px-3 py-2 hover:bg-default-100 rounded-md"
              >
                {isRTL ? 'גווני אפור' : 'Grayscale'}
              </button>
              
              <button
                onClick={features.readableFont}
                className="w-full text-left px-3 py-2 hover:bg-default-100 rounded-md"
              >
                {isRTL ? 'פונט קריא' : 'Readable Font'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 