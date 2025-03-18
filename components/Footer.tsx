'use client'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e:any) => {
    e.preventDefault() // Prevents form reload
    if (!email) {
      toast.error('Please enter a valid email.')
      return
    }
    console.log('Subscribed with:', email)
    // Call your subscription API or function here
    toast.success('Subscribed Successfully! Thank You.', {
      duration: 3000,
    })
    setEmail('')
  }

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Company and Support Links */}
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    ['About', '/about'],
                    ['Careers', '/careers'],
                    ['Blog', '/blog'],
                  ].map(([title, href]) => (
                    <li key={title} className="group">
                      <Link
                        href={href}
                        className="text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 flex items-center"
                      >
                        <span className="mr-2">→</span>
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 md:mt-0 space-y-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    ['Contact', '/contact'],
                    ['Terms', '/terms'],
                    ['Privacy', '/privacy&policy'],
                  ].map(([title, href]) => (
                    <li key={title} className="group">
                      <Link
                        href={href}
                        className="text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 flex items-center"
                      >
                        <span className="mr-2">→</span>
                        {title}
                      </Link>
                    </li>
                  ))}
                  <li className="group">
                    <a
                      href="mailto:support@comradehomes.me"
                      className="text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 flex items-center"
                    >
                      <span className="mr-2">→</span>
                      Email Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-8 xl:mt-0 space-y-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
              Get property insights and market updates
            </p>
            <form className="mt-4 space-y-4" onSubmit={handleSubscribe}>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Subscribe
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0">
            <p className="text-base text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()}{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-300">
                Comrade Homes
              </span>
              . All rights reserved.
            </p>
            <div className="flex space-x-6">
              {/* Social Media Links */}
              {[
                ['Twitter', 'https://twitter.com', 'M24 4.557c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'],
                ['GitHub', 'https://github.com', 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'],
                ['LinkedIn', 'https://linkedin.com', 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'],
              ].map(([name, href, path]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  <span className="sr-only">{name}</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
              {/* DigitalOcean Referral Link */}
              <a
                href="https://www.digitalocean.com/?refcode=221aa32ae14f&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <img
                  src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%203.svg"
                  alt="DigitalOcean Referral Badge"
                  className="w-24 h-10"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}