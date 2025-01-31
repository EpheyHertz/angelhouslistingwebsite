'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import {createBooking} from '@/app/server-action/booking-actions'

export default function BookingForm({ house_id }) {
  const [loading,isLoading]=useState(false)
  const [error,setError]=useState('')
  const [booking, setBooking] = useState({
    house_id: house_id,
    start_date: '',
    end_date: '',
    guest_count: 1,
    room_count:1,
    special_request: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]: name === 'guest_count' ? parseInt(value, 10) : value,
      [name]: name === 'room_count' ? parseInt(value, 10) : value,

    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLoading(true)
    try {
    const response=createBooking(booking)
    if (response.success){
    console.log('Booking submitted:', booking);
    alert('Your booking request has been sent successfully.');
    setBooking({
      house_id: '',
      start_date: '',
      end_date: '',
      room_count:1,
      guest_count: 1,
      special_request: '',
    });
    isLoading(false)
    }else{
      console.log(response.message)
      isLoading(false)
      setError('Error:',response.message||'An error occured! Please try again')
      
    }
      
    } catch (error) {
      console.error(error)
      isLoading(false)
      setError('Error:','An error occured! Please try again:',error)
     
      
    }finally{
      isLoading(false)
    }
    
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-6 rounded-lg shadow-lg border 
                 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 
                 border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-center">Book Your Stay</h2>
       <h3 className='text-red-600 font-semibold'>{error}</h3>
      {!house_id && <div>
        <label
          htmlFor="house_id"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Select House
        </label>
        <select
          id="houseId"
          name="houseId"
          value={booking.house_id}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border 
                     border-gray-300 focus:outline-none focus:ring-blue-500 
                     focus:border-blue-500 sm:text-sm rounded-md 
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          required
        >
          <option value="">Choose a house</option>
          <option value="house1">Cozy Cottage</option>
          <option value="house2">Luxury Villa</option>
          <option value="house3">City Apartment</option>
        </select>
      </div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Check-in Date
          </label>
          <div className="relative mt-1">
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={booking.start_date}
              onChange={handleChange}
              className="block w-full pl-10 sm:text-sm border 
                         border-gray-300 rounded-md focus:ring-blue-500 
                         focus:border-blue-500 dark:bg-gray-700 
                         dark:border-gray-600 dark:text-gray-100"
              required
            />
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 
                         text-gray-400 dark:text-gray-500"
              size={18}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Check-out Date
          </label>
          <div className="relative mt-1">
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={booking.end_date}
              onChange={handleChange}
              className="block w-full pl-10 sm:text-sm border 
                         border-gray-300 rounded-md focus:ring-blue-500 
                         focus:border-blue-500 dark:bg-gray-700 
                         dark:border-gray-600 dark:text-gray-100"
              required
            />
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 
                         text-gray-400 dark:text-gray-500"
              size={18}
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="guest_count"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Number of Guests
        </label>
        <select
          id="guest_count"
          name="guest_count"
          value={booking.guest_count}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border 
                     border-gray-300 focus:outline-none focus:ring-blue-500 
                     focus:border-blue-500 sm:text-sm rounded-md 
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="room_count"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Number of Rooms
        </label>
        <select
          id="room_count"
          name="room_count"
          value={booking.room_count}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border 
                     border-gray-300 focus:outline-none focus:ring-blue-500 
                     focus:border-blue-500 sm:text-sm rounded-md 
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="specialRequests"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Special Requests
        </label>
        <textarea
          id="special_request"
          name="special_request"
          value={booking.special_request}
          onChange={handleChange}
          placeholder="Any special requests or requirements?"
          className="mt-1 block w-full sm:text-sm border border-gray-300 
                     rounded-md h-24 focus:ring-blue-500 focus:border-blue-500 
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium 
                   rounded-md shadow hover:bg-blue-700 focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-200
                   dark:bg-blue-500 dark:hover:bg-blue-600 
                   dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800 "
      >
        { loading ?'Booking Appartment...':'Submit Booking Request'}
      </button>
    </form>
  );
}
