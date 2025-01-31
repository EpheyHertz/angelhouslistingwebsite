'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { useToast, Toast } from "@/components/ui/Toast"
import { api } from '@/app/lib/api/client'
import AdminLayout from '@/components/Adminlayout'
import { Loader } from 'lucide-react'

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()
  const [formData, setFormData] = useState({
    user_id: '',
    house_id: '',
    start_date: '',
    end_date: '',
    status: '',
  })
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [houses, setHouses] = useState([])

  useEffect(() => {
    fetchBookingData()
    fetchUsers()
    fetchHouses()
  }, [])

  const fetchBookingData = async () => {
    try {
      const response = await api.get(`/admins/bookings/${params.id}`)
      setFormData(response.data)
    } catch (error) {
      showToast("Failed to fetch booking data", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admins/users')
      setUsers(response.data)
    } catch (error) {
      showToast("Failed to fetch users", "error")
    }
  }

  const fetchHouses = async () => {
    try {
      const response = await api.get('/admins/houses')
      setHouses(response.data)
    } catch (error) {
      showToast("Failed to fetch houses", "error")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put(`/admins/bookings/${params.id}`, formData)
      showToast("Booking updated successfully", "success")
      router.push('/admin/bookings')
    } catch (error) {
      showToast("Failed to update booking", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <AdminLayout><div className="flex flex-col items-center justify-center min-h-screen">
    <Loader className="animate-spin h-12 w-12 text-blue-500" />
    <p className="mt-4 text-lg">Loading...</p>
  </div></AdminLayout>
  }

  return (
    <AdminLayout>
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit Booking</h1>
      <Select
        name="user_id"
        value={formData.user_id}
        onChange={handleChange}
        required
      >
        <option value="">Select a user</option>
        {users.map((user: any) => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </Select>
      <Select
        name="house_id"
        value={formData.house_id}
        onChange={handleChange}
        required
      >
        <option value="">Select a house</option>
        {houses.map((house: any) => (
          <option key={house.id} value={house.id}>{house.title}</option>
        ))}
      </Select>
      <Input
        name="start_date"
        type="date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />
      <Input
        name="end_date"
        type="date"
        value={formData.end_date}
        onChange={handleChange}
        required
      />
      <Select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="cancelled">Cancelled</option>
      </Select>
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Booking'}
      </Button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </form>
    </AdminLayout>
  )
}

