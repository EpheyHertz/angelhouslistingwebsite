'use client'; // Ensure this is a client component

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store'; // Adjust the import path to your store
import { ThemeProvider } from './ThemeProvider';

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Mark as mounted after the component is ready on the client
  }, []);

  if (!mounted) {
    return null; // Prevent rendering until the component is mounted
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
