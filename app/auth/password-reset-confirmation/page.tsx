'use client'
import Layout from '../../../components/Layout'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PasswordResetConfirmation() {
  return (
    <Layout title="Password Reset Successful | House Listing Platform">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-gray-700/30 hover:-translate-y-1 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10 z-0">
            <div 
              className="absolute w-24 h-24 bg-green-400/30 rounded-full -top-12 -left-12 animate-pulse"
              style={{ animationDelay: '0.3s' }}
            />
            <div 
              className="absolute w-32 h-32 bg-blue-400/30 rounded-full -bottom-16 -right-16 animate-pulse"
              style={{ animationDelay: '0.7s' }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10">
            <CheckCircle 
              className="h-20 w-20 text-green-500 mx-auto mb-6 animate-scale-in"
              style={{ 
                animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                filter: 'drop-shadow(0 4px 6px rgba(34, 197, 94, 0.3))'
              }}
            />
            
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
              Password Reset Successful!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed animate-fade-in-up">
              Your password has been securely updated. You&apos;re all set to access your account with your new credentials.
            </p>

            {/* Inspirational quote */}
            <div className="mb-8 animate-fade-in-up delay-300">
              <div className="border-l-4 border-blue-500 pl-4 italic text-gray-500 dark:text-gray-400">
                &quot;Security is not just a feature, it&apos;s a promise. Protect your digital home as you would your physical one.&quot;
              </div>
            </div>

            {/* Animated button */}
            <Link
              href="/auth/login"
              className="inline-block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 
                         text-white font-semibold py-3 px-8 rounded-lg 
                         hover:scale-105 hover:shadow-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                         transition-all duration-300 
                         transform-gpu
                         relative overflow-hidden
                         group"
            >
              <span className="relative z-10">Continue to Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12" />
            </Link>
          </div>
        </div>
      </div>

   
    </Layout>
  )
}