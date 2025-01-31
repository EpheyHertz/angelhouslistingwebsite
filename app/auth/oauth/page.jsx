'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import Layout from '../../../components/Layout';
import { Loader, XCircle, Home, Key } from 'lucide-react';

export default function OAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState("Home is where your story begins...");
  
  // Curated Unsplash images for real estate theme
  const backgroundImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80'
  ];

  const quotes = [
    "A house is made of walls and beams; a home is built with love and dreams.",
    "Home is the starting place of love, hope, and dreams.",
    "The magic thing about home is that it feels good to leave, and it feels even better to come back."
  ];

  const authenticateUser = async () => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (!access_token || !refresh_token) {
      setError('Missing authentication credentials');
      return;
    }

    try {
      const response = await fetch('/apis/auth/oauth', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!response.ok) throw new Error('Authentication failed');

      const user = await response.json();
      dispatch(login({ access_token, refresh_token, user }));
      router.push('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Secure connection failed. Please try again.');
    }
  };

  useEffect(() => {
    authenticateUser();
    // Cycle through quotes every 5 seconds
    const quoteInterval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, [searchParams]);

  if (error) {
    return (
      <Layout title="Authentication Error">
        <div className="min-h-screen relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{ backgroundImage: `url(${backgroundImages[1]})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/30" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20 dark:border-gray-700/30 animate-slide-up">
              <div className="flex flex-col items-center space-y-6">
                <XCircle className="h-16 w-16 text-red-500 animate-shake" />
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                    Access Denied
                  </h1>
                  <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
                  <div className="mt-4 p-4 bg-red-50/50 dark:bg-gray-800 rounded-xl border-l-4 border-red-500">
                    <p className="italic text-gray-700 dark:text-gray-300">
                      "Success is not final, failure is not fatal: It is the courage to continue that counts."
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full"
                  >
                    Return to Secure Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Secure Authentication">
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${backgroundImages[0]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/30" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20 dark:border-gray-700/30 animate-fade-in">
            <div className="flex flex-col items-center space-y-8">
              <div className="animate-bounce">
                <Key className="h-16 w-16 text-blue-500" strokeWidth={1.5} />
              </div>
              
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Home
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 italic transition-opacity duration-500">
                  {quote}
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 w-full">
                <Loader className="animate-spin h-12 w-12 text-purple-500" />
                <div className="space-y-2 text-center">
                  <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
                    Securing your connection...
                  </p>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i}
                        className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}