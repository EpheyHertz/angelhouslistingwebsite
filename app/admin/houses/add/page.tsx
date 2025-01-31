'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { useToast, Toast } from "@/components/ui/Toast"
import { api } from '@/app/lib/api/client'

export default function HouseForm({ params }) {
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
  const [loading, setLoading] = useState(false)
  const isEditing = params.action === 'edit'

  useEffect(() => {
    if (isEditing) {
      fetchHouseData()
    }
  }, [isEditing])

  const fetchHouseData = async () => {
    try {
      const response = await api.get(`apis/admin/houses/${params.id}`)
      setFormData(response.data)
    } catch (error) {
      showToast("Failed to fetch house data", "error")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSend.append('images', image)
          })
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      if (isEditing) {
        await api.put(`apis/admin/houses/${params.id}`, formDataToSend)
      } else {
        await api.post('apis/admin/houses', formDataToSend)
      }

      showToast(`House ${isEditing ? 'updated' : 'created'} successfully`, "success")
      router.push('/admin/houses')
    } catch (error) {
      showToast(`Failed to ${isEditing ? 'update' : 'create'} house`, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Edit' : 'Add'} House</h1>
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
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Images</label>
        <Input
          id="images"
          name="images"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
        />
      </div>
      {isEditing && formData.images && (
        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-200">Current Images:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.images.map((image, index) => (
              <img key={index} src={image} alt={`House image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : (isEditing ? 'Update' : 'Create') + ' House'}
      </Button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </form>
  )
}

