'use client';

import { Select, SelectItem } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";

export function LanguageSelect() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <Select 
      className="w-32"
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'he' | 'en')}
      label={t.language}
    >
      <SelectItem key="he" value="he">עברית</SelectItem>
      <SelectItem key="en" value="en">English</SelectItem>
    </Select>
  );
} 