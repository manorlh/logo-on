'use client';

import { Select, SelectItem } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";

export function CurrencySelect() {
  const { currency, setCurrency } = useLanguage();
  
  return (
    <Select
      selectedKeys={[currency]}
      value={currency}
      onChange={(e) => setCurrency(e.target.value as 'ILS' | 'USD')}
      size="sm"
      className="w-24"
    >
      <SelectItem key="USD" value="USD">$ USD</SelectItem>
      <SelectItem key="ILS" value="ILS">₪ ILS</SelectItem>
    </Select>
  );
} 