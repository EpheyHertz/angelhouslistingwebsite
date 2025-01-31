import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'

export default function Layout({ children, title = 'House Listing Platform' }) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head>
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
        <div className="fixed bottom-5 right-5">
          <ThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  )
}

