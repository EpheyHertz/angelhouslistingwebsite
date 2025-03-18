'use client'

import { useState, useEffect } from 'react'
import { Loader, Home, Calendar, Edit, X, Plus, Check } from 'lucide-react'
import AddHouseForm from './AddHouseForm'
import EditHouseForm from './EditHouseForm'
import HouseListingTable from './HouseListingTable'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
import { getUserHousesById } from '@/app/server-action/house_actions'
import {fetchUserHousesBookings} from '@/app/server-action/booking-actions';
import {deletePropertyById} from '@/app/server-action/house_actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
export default function HouseOwnerDashboard({ activeTab,user }) {
  const [isAddingHouse, setIsAddingHouse] = useState(false)
  const [editingHouse, setEditingHouse] = useState(null)
  const [houses, setHouses] = useState([])
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router=useRouter();

  useEffect(() => {
    let isMounted = true // Prevent state updates if component unmounts
  
    const fetchData = async () => {
      try {
        setIsLoading(true)
  
        // Run both API calls in parallel
        const [housesData, bookingsData] = await Promise.all([
          getUserHousesById(user.id),
          fetchUserHousesBookings()
        ])
  
        if (isMounted) {
          setHouses(housesData.houses || [])
          setBookings(bookingsData.data || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
  
    fetchData()
  
    return () => {
      isMounted = false // Cleanup function to prevent memory leaks
    }
  }, [user.id]) // Include user.id as a dependency in case it changes
  
  const handleDeleteHouse = async (id) => {
    try {
      // Replace this with actual API call
      await deletePropertyById(id)
      setHouses(houses.filter(house => house.id !== id))
    } catch (error) {
      console.error('Error deleting house:', error)
    }
  }

  // Helper functions for filtering
// Safe filtering functions for houses
const getApprovedHouses = () => {
  return Array.isArray(houses) 
    ? houses.filter(house => house?.is_approved === true)
    : [];
};

const getPendingHouses = () => {
  return Array.isArray(houses)
    ? houses.filter(house => house?.is_approved === false)
    : [];
};

const getRejectedHouses = () => {
  return Array.isArray(houses)
    ? houses.filter(house => house?.is_approved === 'rejected') 
    : [];
};

// Safe filtering functions for bookings
const getApprovedBookings = () => {
  return Array.isArray(bookings)
    ? bookings.filter(booking => booking?.status === 'approved')
    : [];
};

const getPendingBookings = () => {
  return Array.isArray(bookings)
    ? bookings.filter(booking => booking?.status === 'pending')
    : [];
};

const getCancelledBookings = () => {
  return Array.isArray(bookings)
    ? bookings.filter(booking => booking?.status === 'canceled')
    : [];
};

  // Data for house status chart
  const houseStatusData = [
    { name: 'Approved', value: getApprovedHouses().length, fill: '#10B981' },
    { name: 'Pending', value: getPendingHouses().length, fill: '#FBBF24' },
    { name: 'Rejected', value: getRejectedHouses().length || 0, fill: '#EF4444' },
  ]

  // Data for booking status chart
  const bookingStatusData = [
    { name: 'Approved', value: getApprovedBookings().length, fill: '#10B981' },
    { name: 'Pending', value: getPendingBookings().length, fill: '#FBBF24' },
    { name: 'Cancelled', value: getCancelledBookings().length , fill: '#EF4444' },
  ]

// Safely handle house progress data mapping
const houseProgressData = Array.isArray(houses) && houses.length > 0
  ? houses.map(house => ({
      date: house?.created_at ? new Date(house.created_at).toLocaleDateString() : 'Unknown date',
      [house?.status || 'unknown']: 1,
    }))
  : []; // Return empty array when no houses exist

// Safely handle booking progress data mapping
const bookingProgressData = Array.isArray(bookings) && bookings.length > 0
  ? bookings.map(booking => ({
      date: booking?.created_at ? new Date(booking.created_at).toLocaleDateString() : 'Unknown date',
      [booking?.status || 'unknown']: 1,
    }))
  : []; // Return empty array when no bookings exist

// Optional: Add fallback data for empty states to show something in charts
const getDefaultHouseProgressData = () => {
  if (!Array.isArray(houses) || houses.length === 0) {
    return [
      { date: 'No data', pending: 0, approved: 0, rejected: 0 }
    ];
  }
  return houseProgressData;
};
const handleApproveBooking= async (id) => {
  router.push(`/booking/user-management-bookings`);
}
const getDefaultBookingProgressData = () => {
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return [
      { date: 'No data', pending: 0, approved: 0, cancelled: 0 }
    ];
  }
  return bookingProgressData;
};

  if (isLoading) {
    return <Loader className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
  }

  return (
    <div>
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-100">Total Listings</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{houses?.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Approved Listings</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {getApprovedHouses().length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100">Pending Listings</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                {getPendingHouses().length}
              </p>
            </div>
          </div>

          {/* House Status Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">House Status</h3>
            <BarChart width={500} height={300} data={houseStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>

          {/* Booking Status Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Booking Status</h3>
            <BarChart width={500} height={300} data={bookingStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </div>

          {/* House Progress Over Time */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">House Progress Over Time</h3>
            <LineChart width={500} height={300} data={houseProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="approved" stroke="#10B981" />
              <Line type="monotone" dataKey="pending" stroke="#FBBF24" />
              <Line type="monotone" dataKey="rejected" stroke="#EF4444" />
            </LineChart>
          </div>

          {/* Booking Progress Over Time */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Booking Progress Over Time</h3>
            <LineChart width={500} height={300} data={bookingProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="approved" stroke="#10B981" />
              <Line type="monotone" dataKey="pending" stroke="#FBBF24" />
              <Line type="monotone" dataKey="cancelled" stroke="#EF4444" />
            </LineChart>
          </div>
        </div>
      )}

      {/* Rest of the code for listings and bookings tabs remains the same */}
      <div>
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-100">Total Listings</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{houses?.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Approved Listings</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {getApprovedHouses().length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100">Pending Listings</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                {getPendingHouses().length}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Listings</h2>
          {isAddingHouse ? (
            <AddHouseForm onSubmit={handleAddHouse} onCancel={() => setIsAddingHouse(false)} />
          ) : editingHouse ? (
            <EditHouseForm house={editingHouse} onSubmit={handleEditHouse} onCancel={() => setEditingHouse(null)} />
          ) : (
            <>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() =>router.push('/houses/new') }
              >
                <Plus className="inline-block mr-2" />
                Add New Listing
              </button>
              <HouseListingTable
                houses={houses}
                onEdit={setEditingHouse}
                onDelete={handleDeleteHouse}
              />
            </>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">You have no bookings yet.</p>
          ) : (
            

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {bookings.length > 0 ? (
    bookings.map((booking) => (
      <div key={booking.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        {/* House Link */}
        <div className="flex items-center mb-2">
          <Home className="mr-2 text-gray-600 dark:text-gray-400" />
          <Link
            href={`/houses/${booking.house_id}`}
            className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View House
          </Link>
        </div>

        {/* Booking Dates */}
        <div className="flex items-center mb-2">
          <Calendar className="mr-2 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(booking.start_date).toLocaleDateString()} -{' '}
            {new Date(booking.end_date).toLocaleDateString()}
          </p>
        </div>

        {/* Guest Name (Owner Profile Link) */}
        <div className="mb-2">
          <Link
            href={`/profile/${booking.owner_id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Guest Profile
          </Link>
        </div>

        {/* Booking Status */}
        <p
          className={`mb-2 ${
            booking.status === 'approved'
              ? 'text-green-500'
              : booking.status === 'pending'
              ? 'text-yellow-500'
              : 'text-red-500'
          }`}
        >
          Status: {booking.status}
        </p>

        {/* View Booking Details */}
        <div className="mb-2">
          <Link
            href={`/booking/${booking.id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Booking Details
          </Link>
        </div>

        {/* Manage Booking Button */}
        <div className="flex justify-end space-x-2">
          <Link
            href="/booking/user-management-bookings"
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            Manage Bookings
          </Link>
        </div>

        {/* Pending Booking Actions */}
        {booking.status === 'pending' && (
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => handleApproveBooking(booking.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleCancelBooking(booking.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    ))
  ) : (
    ''
  )}
</div>

          )}
        </div>
      )}
    </div>
    </div>
  )
}