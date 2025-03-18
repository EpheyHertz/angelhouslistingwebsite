'use client';
import Link from 'next/link'
import { Home, Users, BookOpen, Mail, Sun, Moon, PlusCircle, Search, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './components/ui/Button'

export default function Sidebar() {
  const { theme, setTheme } = useTheme()

  const navItems = [
    { title: 'Dashboard', icon: Home, href: '/admin' },
    { title: 'Houses', icon: Home, href: '/admin/houses' },
    { title: 'Add House', icon: PlusCircle, href: '/admin/houses/add' },
    { title: 'Users', icon: Users, href: '/admin/users' },
    { title: 'Add User', icon: PlusCircle, href: '/admin/users/add' },
    { title: 'Bookings', icon: BookOpen, href: '/admin/bookings' },
    { title: 'Add Booking', icon: PlusCircle, href: '/admin/bookings/add' },
    { title: 'Bulk Email', icon: Mail, href: '/admin/email' },
    { title: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 py-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <item.icon className="mr-3" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {theme === 'dark' ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>
    </div>
  )
}

