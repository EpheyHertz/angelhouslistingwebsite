'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import EditHouseForm from '../../../../../components/dashboard/EditHouseForm'

function EditHouse({params}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id= searchParams.get("id")

    const houses = [
        { id: '1', title: 'Cozy Cottage', location: 'Countryside', price: 150000, imageUrl: '/placeholder.svg?height=300&width=400', likeCount: 42, bedrooms: 2, bathrooms: 1 },
        { id: '2', title: 'Modern Apartment', location: 'Downtown', price: 300000, imageUrl: '/placeholder.svg?height=300&width=400', likeCount: 28, bedrooms: 3, bathrooms: 2 },
        { id: '3', title: 'Seaside Villa', location: 'Beach Town', price: 500000, imageUrl: '/placeholder.svg?height=300&width=400', likeCount: 56, bedrooms: 4, bathrooms: 3 },
        { id: '4', title: 'Mountain Chalet', location: 'Alps', price: 400000, imageUrl: '/placeholder.svg?height=300&width=400', likeCount: 35, bedrooms: 3, bathrooms: 2 },
        { id: '5', title: 'City Loft', location: 'Metropolis', price: 250000, imageUrl: '/placeholder.svg?height=300&width=400', likeCount: 21, bedrooms: 1, bathrooms: 1 },
        { id: '6', title: 'Suburban Family Home', location: 'Suburbs', price: 350000, imageUrl: '/placeholder.svg?height=300&width=400', likeCount: 49, bedrooms: 4, bathrooms: 3 },
    ]

    // Find the house with the matching ID
    const house = houses.find(h => h.id === id)
    

    if (!house) {
        
        return <div>House not found.</div>
    }

    return <EditHouseForm house={house} />
}

export default EditHouse
