"use client"
import { useState } from 'react'
import Layout from '../../../components/Layout'
import { Loader, Mail, LockKeyhole, Quote } from 'lucide-react'
import Link from 'next/link'

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  // Static Unsplash URL for demonstration (replace with your actual image URL)
  const securityImage = "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=800&q=80"
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setSending(true)
      // Send the request to the API for password reset
      const response = await fetch('/apis/auth/password-request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });
  
      if (response.ok) {
        // If the request is successful, update the UI
        setIsSubmitted(true);
        setSending(false)
        alert('A password reset link has been sent to your email.');
      } else {
        // Handle API errors
        const data = await response.json();
        alert(data?.message || 'Failed to send the password reset request.');
        setError(data?.message || 'Failed to send the password reset request.')
        setSending(false)
      }
    } catch (error) {
      console.error('Error during password reset request:', error);
      alert('An unexpected error occurred. Please try again later.');
      setError('An unexpected error occurred. Please try again later.')
      setSending(false)
      
      
    }
  };

  return (
    <Layout title="Password Reset | House Listing Platform">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image and Quote */}
          <div className="hidden md:block relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={securityImage}
                alt="Security Illustration"
                className="w-full h-96 object-cover animate-fade-in"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-6">
                <blockquote className="text-white font-medium italic">
                  <Quote className="inline-block mr-2 -mt-1" size={20} />
                  &quot;Security is not a product, but a process. It&apos;s about doing the right things even when no one is watching.&quot;
                </blockquote>
                <p className="text-gray-300 text-sm mt-2">- Bruce Schneier</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="animate-slide-up">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col items-center mb-8">
                <LockKeyhole className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4 animate-bounce" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                  Reset Your Password
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Enter your email to receive a reset link
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-95"
                  >
                    {sending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="animate-spin h-5 w-5 text-white" />
                        <span>Sending reset link...</span>
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg transition-all duration-200 animate-shake">
                      {error}
                    </div>
                  )}
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg animate-fade-in">
                    <p>
                      If an account exists for <span className="font-semibold">{email}</span>, 
                      you&apos;ll receive a password reset link shortly.
                    </p>
                  </div>
                  <Link 
                    href="/auth/login"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
                  >
                    ← Return to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}