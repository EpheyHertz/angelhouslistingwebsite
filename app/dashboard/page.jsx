'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../components/Layout';
import UserDashboard from '../../components/dashboard/UserDashboard';
import HouseOwnerDashboard from '../../components/dashboard/HouseOwnerDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import { useAuth } from '../../hooks/hooks';
import { Loader } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    setIsClient(true);
  }, []);

  // While the client isn't fully loaded, show a loader.
  if (!isClient && isLoading) {
    return (
      <Layout title="Loading | House Listing Platform">
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin h-10 w-10 text-blue-500" />
        </div>
      </Layout>
    );
  }

  // If the user is not authenticated, display a message and a link to log in.
  if (!isAuthenticated) {
    return (
      <Layout title="Authentication Required | House Listing Platform">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to access the dashboard
          </h1>
          <Link
            href="/auth/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      </Layout>
    );
  }

  // If user data isn't loaded properly, show an error.
  if (!user) {
    return (
      <Layout title="Error | House Listing Platform">
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-xl">
            Error loading user data. Please try again later.
          </p>
        </div>
      </Layout>
    );
  }

  // Render different dashboards based on the user's role.
  const renderDashboard = () => {
    switch (user.role) {
      case 'regular_user':
        return <UserDashboard activeTab={activeTab} user={user} />;
      case 'house_owner':
        return <HouseOwnerDashboard activeTab={activeTab} user={user} />;
      case 'admin':
        return <AdminDashboard activeTab={activeTab} />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <Layout title="Dashboard | House Listing Platform">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome, {user.full_name}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex flex-wrap">
              <button
                className={`${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings
              </button>
              <button
                className={`${
                  activeTab === 'listings'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('listings')}
              >
                My Listings
              </button>
              {user.role === 'admin' && (
                <>
                  <button
                    className={`${
                      activeTab === 'users'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('users')}
                  >
                    User Management
                  </button>
                  <button
                    className={`${
                      activeTab === 'houses'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('houses')}
                  >
                    House Management
                  </button>
                  <button
                    className={`${
                      activeTab === 'allBookings'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab('allBookings')}
                  >
                    All Bookings
                  </button>
                </>
              )}
            </nav>
          </div>
          <div className="p-6">{renderDashboard()}</div>
        </div>
      </div>
    </Layout>
  );
}
