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

export default function UserForm({ params }) {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const isEditing = params.action === 'edit'

  useEffect(() => {
    if (isEditing) {
      fetchUserData()
    }
  }, [isEditing])

  const fetchUserData = async () => {
    try {
      const response = await api.get(`apis/admin/users/${params.id}`)
      setFormData(response.data)
    } catch (error) {
      showToast("Failed to fetch user data", "error")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        await api.put(`apis/admin/users/${params.id}`, formData)
      } else {
        await api.post('apis/admin/users/', formData)
      }

      showToast(`User ${isEditing ? 'updated' : 'created'} successfully`, "success")
      router.push('/admin/users')
    } catch (error) {
      showToast(`Failed to ${isEditing ? 'update' : 'create'} user`, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Edit' : 'Add'} User</h1>
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
      {!isEditing && (
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
      )}
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
      <Button type="submit" disabled={loading}>
        {loading ? <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader className="animate-spin h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Submitting...</p>
          </div> : (isEditing ? 'Update' : 'Create') + ' User'}
      </Button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </form>
  )
}

