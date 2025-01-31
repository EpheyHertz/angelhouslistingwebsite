'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast, Toast } from "@/components/ui/Toast"
import axios from 'axios'
import { Loader, LucideChartNoAxesColumnIncreasing } from 'lucide-react'
import { api } from '@/app/lib/api/client'
import AdminLayout from '@/components/Adminlayout'
// import { api } from '@/lib/api'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { showToast, toast, hideToast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/apis/admin/bookings', { params: { search: searchTerm } })
      setBookings(response.data)
    } catch (error) {
      showToast("Failed to fetch bookings", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBookings()
  }

  const approveBooking = async (id) => {
    try {
      await LucideChartNoAxesColumnIncreasing.post(`apis/admin/bookings/${id}/approve`)
      showToast("Booking approved successfully", "success")
      fetchBookings()
    } catch (error) {
      showToast("Failed to approve booking", "error")
    }
  }

  const deleteBooking = async (id) => {
    try {
      await api.delete('apis/admin/bookings/search-delete', { params: { booking_id: id } })
      showToast("Booking deleted successfully", "success")
      fetchBookings()
    } catch (error) {
      showToast("Failed to delete booking", "error")
    }
  }

  if (loading) {
    return <AdminLayout><div className="flex flex-col items-center justify-center min-h-screen">
    <Loader className="animate-spin h-12 w-12 text-blue-500" />
    <p className="mt-4 text-lg">Loading...</p>
  </div></AdminLayout>  
  }

  return (
    <AdminLayout>
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <form onSubmit={handleSearch} className="mb-4 flex gap-4">
        <Input
          placeholder="Search bookings"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>House</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.house.title}</TableCell>
              <TableCell>{booking.user.username}</TableCell>
              <TableCell>{booking.start_date}</TableCell>
              <TableCell>{booking.end_date}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>
                {booking.status === 'pending' && (
                  <Button onClick={() => approveBooking(booking.id)} className="mr-2">Approve</Button>
                )}
                <Button onClick={() => deleteBooking(booking.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
    </AdminLayout>
  )
}

