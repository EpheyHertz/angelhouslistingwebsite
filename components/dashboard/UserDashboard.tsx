'use client'

import { useState, useEffect } from 'react'
import { Loader, Home, Calendar, Edit, X } from 'lucide-react'
import { api } from '@/app/lib/api/client'
import {BookingContainer} from '@/components/booking-container'
import { OwnercancelBookingById } from '@/app/server-action/booking-actions'
import { getUserHousesById } from '@/app/server-action/house_actions'
import toast from 'react-hot-toast'
import HousesList from './Houselist';

interface Booking {
  id: number
  house: {
    id: number;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    amenities?: string[];
    imageUrl: string; // New property for a single image
    image_urls: string[];
    owner_id: number; // Owner's ID
    likeCount: number; // Number of likes
    bathrooms: number;
    reviews: {
      reviewerId: number;
      reviewerName: string;
      rating: number;
      comment: string;
    }[]; // Array of reviews
    [key: string]: unknown; // To handle any other dynamic fields
  }
  start_date: string
  end_date: string
  status: 'pending' | 'approved' | 'cancelled'
}

interface UserDashboardProps {
  activeTab: string
  user: {
    id: number
    username: string
    full_name: string
    email: string
    contact_number: string | null
    location: string | null
    profile_image: string | null
    role: 'regular_user' | 'admin'| 'house_owner'
    is_verified: boolean
    verification_status: string
    phone_number: number
    created_at: string
    updated_at: string | null
  }
}

export default function UserDashboard({ activeTab,user }: UserDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelling,isCanceling]=useState(false)
  const [houses,sethouses]=useState([])
  const user_id = user.id
  useEffect(() => {
    // Fetch user's bookings
    const fetchBookings = async () => {
      try {
        // Replace with actual API call
        
          const response = await api.get(`apis/bookings/userBookings`)
          const data = await response.data
          setBookings(data)
          // Mutate data
        
        
        
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBookings()
    fetchUserHouses(user_id)
  }, [user_id])
  const fetchUserHouses = async (id:number) => {
    try {
      // Replace with actual API call
      
        const response = await getUserHousesById(id)
        if(!response){
          toast.error('Failed to get your house',
            {
              duration:3000,
            }
          )
        }else
      {  
      const data = await response.houses
      console.log('User House:',data)
      sethouses(data)
      toast.success('Fetched your Houses Successfully',{
        duration:3000
      })
      }
        // Mutate data
      
      
      
    } catch (error) {
      console.error('Error fetching Houses:', error)
    } finally {
      setIsLoading(false)
    }
  }


  

  const handleCancelBooking = async (bookingId: number) => {
    try {
      isCanceling(true)
      const response=await OwnercancelBookingById(bookingId)
      if(response.success){
        isCanceling(false)
        setBookings(bookings.filter(booking => booking.id !== bookingId))
      }
      else{
        isCanceling(false)
        toast.error(`Error cancelling booking: ${response.message}`,{
          duration:3000,
        })
        
      }
      
    } catch (error) {
      isCanceling(false)
      toast.error(`Error cancelling booking: ${error}`,{
        duration:3000,
      })
      
    }
  }

  const handleUpdateBooking = async (bookingId: number) => {
    // Implement update booking logic
    toast.error('This feature has been delayed!',{
      duration:3000,
    })
    console.log('Update booking:', bookingId)
  }

  if (isLoading) {
    return <Loader className="animate-spin h-10 w-10 text-blue-500" />
  }

  return (
    <div>
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold">{bookings.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Upcoming Trips</h3>
              <p className="text-3xl font-bold">
                {bookings.filter(booking => new Date(booking.start_date) > new Date()).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Past Trips</h3>
              <p className="text-3xl font-bold">
                {bookings.filter(booking => new Date(booking.end_date) < new Date()).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        
        <BookingContainer  bookings={bookings}  handleCancelBooking={handleCancelBooking} handleUpdateBooking={handleUpdateBooking} cancelling={cancelling}/>
       
      )}
      { activeTab==='listings'&&
      (
        <HousesList activeTab={activeTab} houses={houses} user={user} />
      )}

    
     

    </div>
  )
}

