'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import ChatBubble from './ChatComponent'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string[]
}

export default function Layout({ 
  children, 
  title = 'House Listing Platform',
  description = 'Find your dream home with our comprehensive real estate listings. Explore properties, connect with agents, and make informed decisions.',
  keywords = ['real estate', 'property listings', 'home search', 'house hunting']
}: LayoutProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <Footer />

{/* Chat Bubble Component */}
<ChatBubble />

{/* Theme Toggle */}
{/* Theme Toggle */}
<button
  aria-label="Toggle Dark Mode"
  type="button"
  className="fixed bottom-10 right-20 z-[100] w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200 shadow-lg hover:shadow-xl"
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
>
  {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
</button>



    </div>
  )
}