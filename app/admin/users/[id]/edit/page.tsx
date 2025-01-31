'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { useToast, Toast } from "@/components/ui/Toast"
import axios from 'axios'
import { api } from '@/app/lib/api/client'
import { Loader } from 'lucide-react'
// import { api } from '@/lib/api'

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/admins/users/${params.id}`)
      setFormData(response.data)
    } catch (error) {
      showToast("Failed to fetch user data", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put(`/admins/users/${params.id}`, formData)
      showToast("User updated successfully", "success")
      router.push('/admin/users')
    } catch (error) {
      showToast("Failed to update user", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
    <Loader className="animate-spin h-12 w-12 text-blue-500" />
    <p className="mt-4 text-lg">Loading...</p>
  </div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <Input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <Input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <Input
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <Select
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={[
          { value: "admin", label: "Admin" },
          { value: "house_owner", label: "House Owner" },
          { value: "regular_user", label: "Regular User" },
        ]}
      />
      <Select
        name="is_active"
        value={formData.is_active.toString()}
        onChange={handleChange}
        options={[
          { value: "true", label: "Active" },
          { value: "false", label: "Inactive" },
        ]}
      />
      <Button type="submit" disabled={loading}>
        {loading ? <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader className="animate-spin h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Updating...</p>
          </div> : 'Update User'}
      </Button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </form>
  )
}

