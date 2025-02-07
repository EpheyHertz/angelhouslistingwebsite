'use client';

import '../globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useEffect, useState } from 'react';
import { handleTokenFromRedirect } from '../utils/tokenManager';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatComponent';

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    handleTokenFromRedirect(store.dispatch);
  }, []);

  // Ensure the component is only rendered on the client side
  useEffect(() => setMounted(true), []);

  // Return null initially to avoid SSR mismatch
  if (!mounted) return null;

  return (
    <Provider store={store}>
      <div className="flex flex-col min-h-screen overflow-x-hidden ">
        <Navbar />
        <main className="flex-grow w-full max-w-full overflow-x-hidden">
          <Component {...pageProps} />
        </main>
        
        <Footer />
      </div>
    </Provider>
  );
}

export default MyApp;
