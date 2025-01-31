'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader, Quote } from 'lucide-react'
import { ThemeToggle } from '../../../components/ThemeToggle'
import Layout from '../../../components/Layout'
import { useTheme } from 'next-themes'

const VerifyEmail = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verificationStatus, setVerificationStatus] = useState('verifying')
  const [error, setError] = useState(null)
  const { theme } = useTheme()

  // Background image from Unsplash
  const backgroundImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')
      const email = searchParams.get('email')

      if (!token || !email) {
        setVerificationStatus('error')
        setError('Missing verification credentials')
        return
      }

      try {
        const response = await fetch('/apis/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email }),
        })

        if (response.ok) {
          setVerificationStatus('success')
          setTimeout(() => router.push('/auth/login'), 3000)
        } else {
          const data = await response.json()
          setVerificationStatus('error')
          setError(data.message || 'Verification failed')
        }
      } catch (err) {
        setVerificationStatus('error')
        setError('Network error during verification')
      }
    }

    verifyToken()
  }, [searchParams, router])

  return (
    <Layout title='Email Verification Page'>
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-transparent" />

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:shadow-3xl">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated header */}
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Email Verification
            </h2>

            {/* Verification status content */}
            <div className="w-full space-y-8">
              {verificationStatus === 'verifying' && (
                <div className="flex flex-col items-center space-y-4">
                  <Loader className="animate-spin h-16 w-16 text-blue-500" />
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium animate-pulse">
                    Securely verifying your credentials...
                  </p>
                </div>
              )}

              {verificationStatus === 'success' && (
                <div className="flex flex-col items-center space-y-6">
                  <CheckCircle className="h-20 w-20 text-green-500 animate-bounce" />
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Verification Complete! 🎉
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Redirecting to secure login...
                    </p>
                    {/* Motivational quote */}
                    <div className="mt-6 p-4 bg-purple-50/50 dark:bg-gray-800 rounded-xl border-l-4 border-purple-500">
                      <Quote className="h-6 w-6 text-purple-500 mb-2" />
                      <p className="italic text-gray-700 dark:text-gray-300">
                        "Security is not just about technology, it's about trust."
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === 'error' && (
                <div className="flex flex-col items-center space-y-6">
                  <XCircle className="h-20 w-20 text-red-500 animate-shake" />
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Verification Failed
                    </h3>
                    <p className="text-red-500 dark:text-red-400 text-lg">
                      {error}
                    </p>
                    <button
                      onClick={() => router.push('/auth/login')}
                      className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Return to Login Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default VerifyEmail