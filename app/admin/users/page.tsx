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

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    username: '',
    email: '',
  })
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('apis/admin/users/', { params: searchParams })
      setUsers(response.data)
    } catch (error) {
      showToast("Failed to fetch users", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers()
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`apis/admin/users/${id}`)
      showToast("User deleted successfully", "success")
      fetchUsers()
    } catch (error) {
      showToast("Failed to delete user", "error")
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
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <form onSubmit={handleSearch} className="mb-4 grid grid-cols-2 gap-4">
        <Input
          placeholder="Username"
          value={searchParams.username}
          onChange={(e) => setSearchParams({ ...searchParams, username: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={searchParams.email}
          onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
        />
        <Button type="submit">Search</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Link href={`/admin/users/${user.id}/edit`} passHref>
                  <Button variant="outline" className="mr-2">Edit</Button>
                </Link>
                <Button onClick={() => deleteUser(user.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

