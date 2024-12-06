'use client';

import { Select, SelectItem } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";

export function LanguageSelect() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <Select
      selectedKeys={[language]}
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'he' | 'en')}
      size="sm"
      className="w-24"
    >
      <SelectItem key="he" value="he">עברית</SelectItem>
      <SelectItem key="en" value="en">English</SelectItem>
    </Select>
  );
} 