
'use client'
import { useState, useEffect } from 'react'
import { Calendar, DollarSignIcon, Home, House, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cancelBookingById } from '@/app/server-action/booking-actions'
import axios from 'axios'

export function BookingList() {
  const [bookings, setBookings] = useState([])
  const [cancelling, setCancelling] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fetchBookings = async () => {
    try {
      const response = await axios.get('/apis/bookings/userBookings')
      const data = await response.data
     

      if (Array.isArray(data)) {
        setBookings(data)
      } else {
        console.error('API response is not an array:', data)
        setBookings([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }




  useEffect(() => {


    fetchBookings()
  }, [])

  const handleCancelBooking = async (id) => {
    try {
      setCancelling(true)
      const response = await cancelBookingById(id)
      if (!response.success) {
        setCancelling(false)
        setBookings(bookings.filter(booking => booking.id !== id))
        alert("Your booking has been cancelled successfully.")
      } else {
        setCancelling(false)
        console.error('Error cancelling booking:', response.message)
      }
    } catch (error) {
      setCancelling(false)
      console.error('Error cancelling booking:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Bookings</h2>

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Image
                width={64}
                height={64}
                src={booking.house.image_urls[0]}
                alt={booking.house.title}
                className="h-16 w-16 rounded-lg object-cover mr-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{booking.house.title}</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center">
                <Calendar className="mr-2" size={16} />
                {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
              </p>
              <p className="flex items-center">
                <Users className="mr-2" size={16} />
                {booking.guest_count} guest{booking.guest_count > 1 ? 's' : ''}
              </p>
              <p className="flex items-center">
                <House className="mr-2" size={16} />
                {booking.room_count} Room{booking.room_count > 1 ? 's' : ''}
              </p>
              <div className="flex items-center">
                <DollarSignIcon className="mr-2" size={16} />
                <div className="flex flex-col">
                  <p>Total Price:</p>
                  <p className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg text-slate-900 dark:text-slate-100">${booking.total_price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSignIcon className="mr-2" size={16} />
                <div className="flex flex-col">
                  <p>Price per night:</p>
                  <p className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg text-slate-900 dark:text-slate-100">${booking.house.price}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            {booking.status && (
              <button
                disabled={cancelling || booking.status === 'canceled'}
                className={`mt-4 w-full ${
                  booking.status === 'canceled' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                } text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
                onClick={() => handleCancelBooking(booking.id)}
              >
                {booking.status !== 'canceled' ? (
                  cancelling ? 'Cancelling...' : 'Cancel Booking'
                ) : (
                  'Booking Cancelled'
                )}
              </button>
            )}
          </div>
          ))}
        </div>
      )}
    </div>
  )
}