import '../app/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Sidebar from '@/components/Sidebar'
import Layout from './Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Comprehensive admin dashboard for managing houses, users, and bookings',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <Layout>
          <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">
              {children}
            </main>
          </div>
          </Layout>
        
     
    
  )
}

