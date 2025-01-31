'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, Home, Building, BookOpen, Calendar, ShoppingCart, Contact, Briefcase, FileText, Settings, ChevronDown } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { logout } from '../store/authSlice'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { 
    name: 'Houses', 
    icon: Building,
    subItems: [
      { name: 'Browse Houses', href: '/houses' },
      { name: 'Add Property', href: '/houses/new' },
    ]
  },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { 
    name: 'Bookings', 
    icon: Calendar,
    subItems: [
      { name: 'My Bookings', href: '/booking' },
      { name: 'Booking Management', href: '/booking/user-management-bookings' },
    ]
  },
  { name: 'Cart', href: '/cart-page', icon: ShoppingCart },
  { 
    name: 'Company', 
    icon: Briefcase,
    subItems: [
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
    ]
  },
  { 
    name: 'Legal', 
    icon: FileText,
    subItems: [
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy&policy' },
    ]
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const router = useRouter()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark', !isDarkMode)
  }
  const  handleLogout = async()=>{
    try {
      dispatch(logout())
      toast.success(`Logout Successful`,{
        duration:3000,
      })
      router.push('/auth/login')
    } catch (error) {
      toast.error(`Failed to logout:${error}`,{
        duration:3000,
      })
    }

  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm' : 'bg-white dark:bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <img className="h-8 w-8 rounded-lg" src="/icon.png" alt="Logo" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navigation.map((item) => (
                  item.subItems ? (
                    <div key={item.name} className="relative group"
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                        <item.icon className="w-5 h-5" />
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 transition-all duration-300 ${openDropdown === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`block px-4 py-2 text-sm ${
                              router.pathname === subItem.href 
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700' 
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        router.pathname === item.href
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                      {router.pathname === item.href && (
                        <span className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-blue-600 dark:bg-blue-400 -translate-x-1/2 rounded-full animate-nav-underline" />
                      )}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    href={`/profile/${user?.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    href="/profile/update"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" /> Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'top-1/2 rotate-45' : 'top-1'}`} />
                <span className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-1/2'}`} />
                <span className={`absolute left-0 w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'top-1/2 -rotate-45' : 'bottom-1'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-y-auto transition-all duration-300 ${isOpen ? 'h-[calc(100vh-4rem)]' : 'h-0'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1">
          {navigation.map((item) => (
            item.subItems ? (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                </button>
                <div className={`pl-4 ${openDropdown === item.name ? 'block' : 'hidden'}`}>
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`block px-3 py-2 text-sm font-medium rounded-md ${
                        router.pathname === subItem.href
                          ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium ${
                  router.pathname === item.href
                    ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          ))}
        </div>

        {/* Mobile User Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-2">
          {isAuthenticated ? (
            <div className="px-2 space-y-2">
              <Link
                href={`/profile/${user?.id}`}
                className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
              <Link
                href="/profile/update"
                className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
                Update Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-5 h-5" />
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <User className="w-5 h-5" />
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}