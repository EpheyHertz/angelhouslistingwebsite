'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogOut, Home, Building, BookOpen, Calendar, ShoppingCart, Menu, X, Sun, Moon, ChevronDown, ChevronRight, Briefcase, FileText, Settings } from 'lucide-react'
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
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const router = useRouter()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  
  const lastScrollY = useRef(0)
  const isNavbarVisibleRef = useRef(isNavbarVisible)

  // Update ref when state changes
  useEffect(() => {
    isNavbarVisibleRef.current = isNavbarVisible
  }, [isNavbarVisible])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return // Don't hide navbar if mobile menu is open

      const currentScrollY = window.scrollY
      const isScrolled = currentScrollY > 10
      setScrolled(isScrolled)

      // Scroll direction detection
      if (currentScrollY > lastScrollY.current) {
        // Scroll down
        if (currentScrollY > 100 && isNavbarVisibleRef.current) {
          setIsNavbarVisible(false)
        }
      } else {
        // Scroll up
        if (!isNavbarVisibleRef.current) {
          setIsNavbarVisible(true)
        }
      }

      // Reset to visible if at top
      if (currentScrollY === 0) {
        setIsNavbarVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [router.pathname])

  // Dark mode initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true' || 
        (!('darkMode' in localStorage) && 
        window.matchMedia('(prefers-color-scheme: dark)').matches)
      
      setIsDarkMode(isDark)
      document.documentElement.classList.toggle('dark', isDark)
    }
  }, [])

  // Toggle body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.documentElement.classList.toggle('dark', newMode)
    localStorage.setItem('darkMode', String(newMode))
  }

  const handleLogout = async() => {
    try {
      dispatch(logout())
      toast.success('Logout Successful', { duration: 3000 })
      router.push('/auth/login')
    } catch (error) {
      toast.error(`Failed to logout: ${error}`, { duration: 3000 })
    }
  }

  return (
    <nav 
      className={`fixed w-full z-50 transform transition-all duration-500 ease-out ${
        isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-3' 
          : 'bg-white dark:bg-gray-900 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <img 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
                src="/icon.png" 
                alt="Logo" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              item.subItems ? (
                <div 
                  key={item.name} 
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button 
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group"
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 transition-all duration-300 origin-top ${
                      openDropdown === item.name 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-4 py-2.5 text-sm transition-all duration-200 ${
                          router.pathname === subItem.href 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700/60 font-medium' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40 hover:pl-6'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-0 h-0.5 bg-blue-500 transition-all duration-300 ${router.pathname === subItem.href ? 'w-3' : 'group-hover:w-2'}`}></span>
                          {subItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-1.5
                    ${router.pathname === item.href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`}
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.name}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
                    ${router.pathname === item.href ? 'scale-x-100' : ''}`}
                  />
                </Link>
              )
            ))}
          </div>

          {/* Right Side Controls - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 hover:rotate-12 transition-transform duration-300" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  <User className="w-4 h-4" />
                  <span className="font-medium max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 transition-all duration-300 transform origin-top-right opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                  <Link
                    href={`/profile/${user?.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-200 hover:pl-6"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    href="/profile/update"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-200 hover:pl-6"
                  >
                    <Settings className="w-4 h-4" /> Update Profile
                  </Link>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-200 hover:pl-6 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90 animate-in" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300 hover:rotate-12" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white dark:bg-gray-900 z-40 transition-all duration-500 ease-in-out transform lg:hidden ${
          isOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
        style={{ top: '60px' }}
      >
        <div className="max-h-[calc(100vh-60px)] overflow-y-auto pb-20">
          <div className="px-4 py-6 space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
            {navigation.map((item, index) => (
              <div 
                key={item.name} 
                className={`py-2 ${index === 0 ? 'pt-0' : ''}`}
              >
                {item.subItems ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 transition-all duration-300 ${openDropdown === item.name ? 'text-blue-500 dark:text-blue-400' : ''}`} />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ease-in-out ${openDropdown === item.name ? 'rotate-180 text-blue-500 dark:text-blue-400' : ''}`} />
                    </button>
                    
                    <div 
                      className={`pl-6 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                        openDropdown === item.name 
                          ? 'max-h-96 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            router.pathname === subItem.href
                              ? 'bg-blue-50 dark:bg-gray-700/60 text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40 hover:translate-x-1'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className={`w-1 h-1 rounded-full mr-2 ${router.pathname === subItem.href ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                            {subItem.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ${
                      router.pathname === item.href
                        ? 'bg-blue-50 dark:bg-gray-700/60 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40 hover:translate-x-1'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile User Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-6 px-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                <Link
                  href={`/profile/${user?.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <Link
                  href="/profile/update"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  Update Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}