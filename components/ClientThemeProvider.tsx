'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure the component is mounted before accessing the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <>
      {children}
      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="fixed z-10 bottom-5 right-5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-12 h-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </>
  );
}
