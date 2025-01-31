'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/Button"
import { useToast, Toast } from "@/components/ui/Toast"
import { BookingForm } from "@/components/BookingForm"
import axios from 'axios'
import { api } from '@/app/lib/api/client'
import { Loader } from 'lucide-react'


export default function HouseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams=useSearchParams()
 
  const [house, setHouse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    fetchHouseData()
  }, [])

  const fetchHouseData = async () => {
    try {
      const response = await api.get(`apis/houses/oneHouse/${params.id}?house_id=${params.id}`)
      console.log(response.data)
      setHouse(response.data)
    } catch (error) {
      showToast("Failed to fetch house data", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
    <Loader className="animate-spin h-12 w-12 text-blue-500" />
    <p className="mt-4 text-lg">Loading...</p>
  </div>
  }

  if (!house) {
    return <div>House not found</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{house.title}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">House Details</h2>
          <p><strong>Location:</strong> {house.location}</p>
          <p><strong>Price:</strong> ${house.price}</p>
          <p><strong>Room Count:</strong> {house.room_count}</p>
          <p><strong>Type:</strong> {house.type}</p>
          <p><strong>Amenities:</strong> {house.amenities}</p>
          <p><strong>Description:</strong> {house.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Images</h2>
          <div className="grid grid-cols-2 gap-2">
            {house.image_urls && house.image_urls.map((image: string, index: number) => (
              <img key={index} src={image} alt={`House image ${index + 1}`} className="w-full h-48 object-cover rounded" />
            ))}
          </div>
        </div>
      </div>
      <div>
        <BookingForm houseId={params.id} />
      </div>
      <div>
        <Button onClick={() => router.push(`/admin/houses/${params.id}/edit`)}>Edit House</Button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

