'use client';

import Link from 'next/link';
import { useLanguage } from '../LanguageContext';
import { usePathname } from 'next/navigation';

export function Logo({ className = "", size = 40 }: { className?: string, size?: number }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const isRTL = language === 'he' || language === 'ar';
  
  // Extract language from URL path
  const pathParts = pathname.split('/').filter(Boolean);
  const urlLang = pathParts[0] === 'en' || pathParts[0] === 'he' || pathParts[0] === 'ar' 
    ? pathParts[0] 
    : language;

  return (
    <Link href={`/${urlLang}`} className={`flex items-center gap-2 ${className} hover:opacity-80 transition-opacity`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Background frame */}
        <rect
          x="10"
          y="20"
          width="60"
          height="60"
          rx="6"
          className="fill-primary-200 dark:fill-primary-900"
          opacity="0.5"
        />
        
        {/* Main frame */}
        <rect
          x="20"
          y="15"
          width="60"
          height="60"
          rx="6"
          className="fill-primary-500"
        />
        
        {/* Target crosshair */}
        <circle
          cx="50"
          cy="45"
          r="15"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="4 2"
          fill="none"
        />
        
        {/* Target dot */}
        <circle
          cx="50"
          cy="45"
          r="3"
          className="fill-secondary-500"
        />
        
        {/* Corner accent */}
        <path
          d="M70 25L80 25L80 35"
          stroke="white"
          strokeWidth="3"
          className="stroke-secondary-500"
        />
        
        {/* Bottom accent */}
        <rect
          x="35"
          y="65"
          width="30"
          height="4"
          rx="2"
          className="fill-secondary-500"
        />
      </svg>
      <span className="font-bold text-xl">
        your<span className="text-primary">logo</span>here<span className="text-secondary">.app</span>
      </span>
    </Link>
  );
} 