'use client'
import { useState } from 'react'
import Layout from '../../../components/Layout'
import Link from 'next/link'
import { Users, Home, Activity, Plus, Edit, Trash2 } from 'lucide-react'

// Mock data - replace with actual API calls
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
]

const mockHouses = [
  { id: '1', title: 'Cozy Cottage', owner: 'John Doe', status: 'approved' },
  { id: '2', title: 'Modern Apartment', owner: 'Jane Smith', status: 'pending' },
]

const mockActivity = [
  { id: '1', action: 'User Login', user: 'John Doe', timestamp: '2023-06-15T10:30:00Z' },
  { id: '2', action: 'House Listed', user: 'Jane Smith', timestamp: '2023-06-15T11:45:00Z' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Layout title="Admin Dashboard | Real Estate Platform">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'houses'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('houses')}
            >
              Houses
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'houses'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('houses')}
            >
              Bookings
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Activity Log
            </button>
          </div>
          <div className="p-4">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-100">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{mockUsers.length}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">Total Houses</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-300">{mockHouses.length}</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                    {mockHouses.filter(house => house.status === 'pending').length}
                  </p>
                </div>
              </div>
            )}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
                  <Link href="/admin/users/add" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Link>
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {mockUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/users/edit/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-2">
                            <Edit className="h-5 w-5 inline" />
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'houses' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Houses</h2>
                  <Link href="/admin/houses/add" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add House
                  </Link>
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {mockHouses.map((house) => (
                      <tr key={house.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{house.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{house.owner}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{house.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/houses/edit/${house.id}`} className="text-blue-600 hover:text-blue-900 mr-2">
                            <Edit className="h-5 w-5 inline" />
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity Log</h2>
                <ul className="space-y-4">
                  {mockActivity.map((activity) => (
                    <li key={activity.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{activity.action}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-300">{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">By: {activity.user}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
