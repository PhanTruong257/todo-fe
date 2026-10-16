import { useState, useEffect } from 'react';

export type AppTheme = 'blossom' | 'dark';

const THEME_STORAGE_KEY = 'taskflow_theme';

export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'blossom') {
        return saved;
      }
    }
    // Mặc định là tone hồng hoa anh đào sáng sủa, thanh lịch
    return 'blossom';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'blossom' ? 'dark' : 'blossom'));
  };

  return { theme, toggleTheme, setTheme };
}
