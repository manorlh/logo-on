'use client';

import { Select, SelectItem } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  
  const handleLanguageChange = (value: string) => {
    const newLang = value as 'he' | 'en';
    
    // Update cookie
    Cookies.set('NEXT_LOCALE', newLang, { expires: 365 });
    
    // Update context
    setLanguage(newLang);
    
    // Update URL
    router.push(`/${newLang}`);
  };

  return (
    <Select
      selectedKeys={[language]}
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value)}
      size="sm"
      className="w-24"
    >
      <SelectItem key="he" value="he">עברית</SelectItem>
      <SelectItem key="en" value="en">English</SelectItem>
    </Select>
  );
} 