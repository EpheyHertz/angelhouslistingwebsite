'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { useToast, Toast } from "@/components/ui/Toast"
import axios from 'axios'
import { api } from '@/app/lib/api/client'
import { Loader } from 'lucide-react'

export default function SettingsPage() {
  const { toast, showToast, hideToast } = useToast()
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    defaultCurrency: 'USD',
    bookingApprovalRequired: 'true',
    maintenanceMode: 'false',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/admin/settings', formData)
      console.log('Settings updated:', formData)
      showToast("Settings updated successfully", "success")
    } catch (error) {
      showToast("Failed to update settings", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Site Name</label>
          <Input
            id="siteName"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            placeholder="My Awesome Rental Site"
            required
          />
        </div>
        <div>
          <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Site Description</label>
          <Textarea
            id="siteDescription"
            name="siteDescription"
            value={formData.siteDescription}
            onChange={handleChange}
            placeholder="A brief description of your rental platform"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contact Email</label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Default Currency</label>
          <Select
            id="defaultCurrency"
            name="defaultCurrency"
            value={formData.defaultCurrency}
            onChange={handleChange}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'JPY', label: 'JPY' },
            ]}
          />
        </div>
        <div>
          <label htmlFor="bookingApprovalRequired" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Booking Approval Required</label>
          <Select
            id="bookingApprovalRequired"
            name="bookingApprovalRequired"
            value={formData.bookingApprovalRequired}
            onChange={handleChange}
            options={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
          />
        </div>
        <div>
          <label htmlFor="maintenanceMode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Maintenance Mode</label>
          <Select
            id="maintenanceMode"
            name="maintenanceMode"
            value={formData.maintenanceMode}
            onChange={handleChange}
            options={[
              { value: 'true', label: 'On' },
              { value: 'false', label: 'Off' },
            ]}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader className="animate-spin h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Updating...</p>
          </div> : 'Update Settings'}
        </Button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}
