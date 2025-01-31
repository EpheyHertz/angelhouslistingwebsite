import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

import './globals.css';

import GlobalProviders from '@/components/GlobalProviders';

export const metadata: Metadata = {
  title: 'House Listing Platform',
  description: 'Your Housing Partner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <GlobalProviders>
          <main className="flex-grow container mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
            <Toaster position="top-right" />
          </main>
        </GlobalProviders>
      </body>
    </html>
  );
}

