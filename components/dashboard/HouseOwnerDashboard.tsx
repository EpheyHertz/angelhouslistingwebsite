'use client'

import { useState, useEffect } from 'react'
import { Loader, Home, Calendar, Edit, X, Plus, Check } from 'lucide-react'
import AddHouseForm from './AddHouseForm'
import EditHouseForm from './EditHouseForm'
import HouseListingTable from './HouseListingTable'

interface House {
  id: string
  title: string
  location: string
  price: number
  status: 'approved' | 'pending' | 'rejected'
}

interface Booking {
  id: string
  houseId: string
  houseName: string
  guestName: string
  checkIn: string
  checkOut: string
  status: 'pending' | 'approved' | 'cancelled'
}

interface HouseOwnerDashboardProps {
  activeTab: string
}

export default function HouseOwnerDashboard({ activeTab }: HouseOwnerDashboardProps) {
  const [isAddingHouse, setIsAddingHouse] = useState(false)
  const [editingHouse, setEditingHouse] = useState<House | null>(null)
  const [houses, setHouses] = useState<House[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace these with actual API calls
        const housesResponse = await fetch('/api/owner/houses')
        const housesData = await housesResponse.json()
        setHouses(housesData)

        const bookingsResponse = await fetch('/api/owner/bookings')
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddHouse = async (newHouse: Omit<House, 'id' | 'status'>) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/owner/houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHouse),
      })
      const addedHouse = await response.json()
      setHouses([...houses, addedHouse])
      setIsAddingHouse(false)
    } catch (error) {
      console.error('Error adding house:', error)
    }
  }

  const handleEditHouse = async (updatedHouse: House) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/owner/houses/${updatedHouse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHouse),
      })
      const editedHouse = await response.json()
      setHouses(houses.map(house => house.id === editedHouse.id ? editedHouse : house))
      setEditingHouse(null)
    } catch (error) {
      console.error('Error updating house:', error)
    }
  }

  const handleDeleteHouse = async (houseId: string) => {
    try {
      // Replace with actual API call
      await fetch(`/api/owner/houses/${houseId}`, { method: 'DELETE' })
      setHouses(houses.filter(house => house.id !== houseId))
    } catch (error) {
      console.error('Error deleting house:', error)
    }
  }

  const handleApproveBooking = async (bookingId: string) => {
    try {
      // Replace with actual API call
      await fetch(`/api/owner/bookings/${bookingId}/approve`, { method: 'POST' })
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'approved' } : booking
      ))
    } catch (error) {
      console.error('Error approving booking:', error)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // Replace with actual API call
      await fetch(`/api/owner/bookings/${bookingId}/cancel`, { method: 'POST' })
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ))
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  if (isLoading) {
    return <Loader className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
  }

  return (
    <div>
      {activeTab === 'overview' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-100">Total Listings</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{houses.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Approved Listings</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {houses.filter(house => house.status === 'approved').length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100">Pending Listings</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                {houses.filter(house => house.status === 'pending').length}
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
                onClick={() => setIsAddingHouse(true)}
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
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex items-center mb-2">
                    <Home className="mr-2 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.houseName}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Guest: {booking.guestName}</p>
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2 text-gray-600 dark:text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`mb-2 ${
                    booking.status === 'approved' ? 'text-green-500' :
                    booking.status === 'pending' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    Status: {booking.status}
                  </p>
                  <div className="flex justify-end space-x-2">
                    {booking.status === 'pending' && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

