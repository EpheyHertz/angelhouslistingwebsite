'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { useToast, Toast } from "@/components/ui/Toast"
import axios from 'axios'
import { api } from '@/app/lib/api/client'
import { Loader } from 'lucide-react'


export default function EditHousePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    price: '',
    room_count: '',
    type: '',
    amenities: '',
    images: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHouseData()
  }, [])

  const fetchHouseData = async () => {
    try {
      const response = await api.get(`/admins/houses/${params.id}`)
      setFormData(response.data)
    } catch (error) {
      showToast("Failed to fetch house data", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            if (image instanceof File) {
              formDataToSend.append('images', image)
            }
          })
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      await api.put(`/admins/houses/${params.id}`, formDataToSend)
      showToast("House updated successfully", "success")
      router.push('/admin/houses')
    } catch (error) {
      showToast("Failed to update house", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...Array.from(e.target.files)] }))
    }
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
    <Loader className="animate-spin h-12 w-12 text-blue-500" />
    <p className="mt-4 text-lg">Loading...</p>
  </div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit House</h1>
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <Input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        required
      />
      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <Input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <Input
        name="room_count"
        type="number"
        value={formData.room_count}
        onChange={handleChange}
        placeholder="Number of Rooms"
        required
      />
      <Select
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={[
          { value: "apartment", label: "Apartment" },
          { value: "house", label: "House" },
          { value: "villa", label: "Villa" },
        ]}
      />
      <Input
        name="amenities"
        value={formData.amenities}
        onChange={handleChange}
        placeholder="Amenities (comma-separated)"
      />
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Add More Images</label>
        <Input
          id="images"
          name="images"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
      </div>
      {formData.images && formData.images.length > 0 && (
        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-200">Current Images:</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {formData.images.map((image, index) => (
              <img key={index} src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt={`House image ${index + 1}`} className="w-full h-32 object-cover rounded" />
            ))}
          </div>
        </div>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update House'}
      </Button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </form>
  )
}

