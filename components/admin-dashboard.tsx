"use client"

import { useState } from 'react'
import { useTheme } from 'next-themes'
import axios from 'axios'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/input'
import { Moon, Sun } from 'lucide-react'

export default function AdminDashboard() {
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { theme, setTheme } = useTheme()

  const fetchHouses = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/admin/houses')
      setHouses(response.data)
    } catch (err) {
      setError('Failed to fetch houses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </div>
      <div className="mb-4">
        <Button onClick={fetchHouses} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Houses'}
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Approved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {houses.map((house: any) => (
            <TableRow key={house.id}>
              <TableCell>{house.id}</TableCell>
              <TableCell>{house.title}</TableCell>
              <TableCell>{house.location}</TableCell>
              <TableCell>${house.price}</TableCell>
              <TableCell>{house.is_approved ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

