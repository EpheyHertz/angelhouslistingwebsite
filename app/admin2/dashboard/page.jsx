'use client'

import { useState } from 'react'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import AdminDashboard from '../../../components/dashboard/AdminDashboard'
import { Users, Home, Activity, Plus, Edit, Trash2 } from 'lucide-react'
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats] = useState({
    totalUsers: 1250,
    totalHouses: 3750,
    pendingApprovals: 42,
    recentActivity: 78
  })

  return (
    <Layout title="Admin Dashboard | Real Estate House Listing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/users" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">View all</Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Houses</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalHouses}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/houses" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">View all</Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Bookings</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingApprovals}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/approvals" className="font-medium text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300">View all</Link>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Approvals</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingApprovals}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/approvals" className="font-medium text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300">View all</Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Recent Activity</dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.recentActivity}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link href="/admin/activity" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">View all</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/users/add" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Add User
              </Link>
              <Link href="/admin/houses/add" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Add House
              </Link>
              <Link href="/admin/approvals" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Review Approvals
              </Link>
              <Link href="/admin/reports" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Generate Reports
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">New user registered: John Doe</p>
              </li>
              <li className="py-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">House listing approved: 123 Main St</p>
              </li>
              <li className="py-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">User updated profile: Jane Smith</p>
              </li>
              <li className="py-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">New house listed: 456 Elm St</p>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
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
                          <Link href={`/admin/houses/edit/${house.id}?id=${house.id}`} className="text-blue-600 hover:text-blue-900 mr-2">
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
        <AdminDashboard/>
      </div>
    </Layout>
  )
}

