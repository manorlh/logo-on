'use client';

import { Switch } from "@nextui-org/react";
import { useTheme } from "../ThemeContext";
import { MoonIcon, SunIcon } from '../icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Switch
      defaultSelected={theme === 'dark'}
      size="lg"
      color="secondary"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      onChange={toggleTheme}
      aria-label="Toggle theme"
    />
  );
} 