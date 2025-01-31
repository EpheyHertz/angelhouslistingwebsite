'use client'
import React from 'react'
import { Home,Calendar, DollarSignIcon,Edit,XIcon,ViewIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function BookingContainer({bookings, handleUpdateBooking,handleCancelBooking,cancelling}) {
  const router=useRouter()
  return (
    <div>
          <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <p>You have no bookings yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex flex-col items-center mb-2">
                    <Link href={`/houses/${booking.house.id}?id=${booking.house.id}`} className='flex flex-row'>
                    <Home className="mr-2" />
                    <Image
                    width={50}
                    height={50}
                    src={booking.house.image_urls[0]}
                    alt={booking.house.title}
                     className="h-20 w-20 rounded-full object-cover mr-6"
                    />
                    <h3 className="text-lg font-semibold">{booking.house.title}</h3>
                    </Link>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2" />
                    <p>{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                  <DollarSignIcon className="mr-2" size={16} />
                  <p className='text-lg text-black dark:text-slate-200'>Total Price:</p>
                 
                  {booking.total_price}
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="mr-2" size={16} />
                  <p>Price of the room of the house:</p>
                   
                  {booking.house.price}
                </div>
                  <p className={`mb-2 ${
                    booking.status === 'approved' ? 'text-green-500' :
                    booking.status === 'pending' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    Status: {booking.status}
                  </p>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleUpdateBooking(booking.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                    disabled={cancelling}
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                     {cancelling?'Cancelling Booking...':<XIcon className="h-4 w-4" />}
                    </button>
                    <button
                    disabled={cancelling}
                      onClick={() => router.push(`/booking/${booking.id}`)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                     <ViewIcon className='h-4 w-4'/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  )
}

