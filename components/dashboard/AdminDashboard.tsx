"use client"
import { useState } from 'react'
import HouseListingTable from './HouseListingTable'
import UserManagementTable from './UserManagementTable'
import ActivityLog from './ActivityLog'

interface AdminDashboardProps {
  activeTab: string
}

export default function AdminDashboard({ activeTab }: AdminDashboardProps) {
  // Mock data for houses
  const [houses, setHouses] = useState([
    { id: '1', title: 'Cozy Cottage', location: 'Countryside', price: 150000, status: 'pending' },
    { id: '2', title: 'Modern Apartment', location: 'Downtown', price: 300000, status: 'approved' },
    { id: '3', title: 'Seaside Villa', location: 'Beach Town', price: 500000, status: 'rejected' },
  ])

  // Mock data for users
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'owner', status: 'pending' },
    { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  ])

  const handleApproveReject = (houseId: string, newStatus: 'approved' | 'rejected') => {
    setHouses(houses.map(house => house.id === houseId ? { ...house, status: newStatus } : house))
  }

  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'banned') => {
    setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user))
  }

  if (activeTab === 'overview') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Admin Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-100">Total Listings</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{houses.length}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Active Users</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-300">
              {users.filter(user => user.status === 'active').length}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100">Pending Approvals</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
              {houses.filter(house => house.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'users') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Management</h2>
        <UserManagementTable users={users} onStatusChange={handleUserStatusChange} />
      </div>
    )
  }

  if (activeTab === 'activity') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Activity Log</h2>
        <ActivityLog />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Listing Approvals</h2>
      <HouseListingTable
        houses={houses.filter(house => house.status === 'pending')}
        onApprove={(id) => handleApproveReject(id, 'approved')}
        onReject={(id) => handleApproveReject(id, 'rejected')}
      />
    </div>
  )
}

