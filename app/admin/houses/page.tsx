'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast, Toast } from "@/components/ui/Toast"
// import { api } from '@/lib/api'
import Link from 'next/link'
import axios from 'axios'
import { api } from '@/app/lib/api/client'
import { Loader } from 'lucide-react'

export default function HousesPage() {
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    title: '',
    location: '',
    owner_email: '',
    min_price: '',
    max_price: '',
  })
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    fetchHouses()
  }, [])

  const fetchHouses = async () => {
    try {
      const response = await api.get('apis/admin/houses/', { params: searchParams })
      setHouses(response.data)
    } catch (error) {
      showToast("Failed to fetch houses", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchHouses()
  }

  const approveHouse = async (id) => {
    try {
      await api.put(`apis/admin/houses/${id}/approve`)
      showToast("House approved successfully", "success")
      fetchHouses()
    } catch (error) {
      showToast("Failed to approve house", "error")
    }
  }

  const rejectHouse = async (id) => {
    try {
      await api.put(`apis/admin/houses/${id}/reject`)
      showToast("House rejected successfully", "success")
      fetchHouses()
    } catch (error) {
      showToast("Failed to reject house", "error")
    }
  }

  const deleteHouse = async (id) => {
    try {
      await api.delete(`apis/admin/houses/${id}`)
      showToast("House deleted successfully", "success")
      fetchHouses()
    } catch (error) {
      showToast("Failed to delete house", "error")
    }
  }

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
    <Loader className="animate-spin h-12 w-12 text-blue-500" />
    <p className="mt-4 text-lg">Loading...</p>
  </div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Houses</h1>
      <form onSubmit={handleSearch} className="mb-4 grid grid-cols-2 gap-4">
        <Input
          placeholder="Title"
          value={searchParams.title}
          onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
        />
        <Input
          placeholder="Location"
          value={searchParams.location}
          onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
        />
        <Input
          placeholder="Owner Email"
          value={searchParams.owner_email}
          onChange={(e) => setSearchParams({ ...searchParams, owner_email: e.target.value })}
        />
        <Input
          placeholder="Min Price"
          type="number"
          value={searchParams.min_price}
          onChange={(e) => setSearchParams({ ...searchParams, min_price: e.target.value })}
        />
        <Input
          placeholder="Max Price"
          type="number"
          value={searchParams.max_price}
          onChange={(e) => setSearchParams({ ...searchParams, max_price: e.target.value })}
        />
        <Button type="submit">Search</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {houses.map((house) => (
            <TableRow key={house.id}>
              <TableCell>
                <Link href={`/admin/houses/${house.id}`} className="text-blue-500 hover:underline">
                  {house.title}
                </Link>
              </TableCell>
              <TableCell>{house.location}</TableCell>
              <TableCell>${house.price}</TableCell>
              <TableCell>{house.is_approved ? 'Approved' : 'Pending'}</TableCell>
              <TableCell>
                {!house.is_approved && (
                  <>
                    <Button onClick={() => approveHouse(house.id)} className="mr-2">Approve</Button>
                    <Button onClick={() => rejectHouse(house.id)} variant="destructive" className="mr-2">Reject</Button>
                  </>
                )}
                <Link href={`/admin/houses/${house.id}/edit`} passHref>
                  <Button variant="outline" className="mr-2">Edit</Button>
                </Link>
                <Button onClick={() => deleteHouse(house.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

