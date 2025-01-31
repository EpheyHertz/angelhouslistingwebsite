'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { useToast, Toast } from "@/components/ui/Toast"
import axios from 'axios'
import { api } from '@/app/lib/api/client'
import { Loader } from 'lucide-react'


export default function BulkEmailPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message_body: '',
    call_to_action_url: '',
    call_to_action_text: '',
  })
  const [loading, setLoading] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/admins/send-bulk-email', formData)
      showToast("Bulk email sent successfully", "success")
      setFormData({
        subject: '',
        message_body: '',
        call_to_action_url: '',
        call_to_action_text: '',
      })
    } catch (error) {
      showToast("Failed to send bulk email", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Send Bulk Email</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Subject</label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message_body" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Message Body</label>
          <Textarea
            id="message_body"
            name="message_body"
            value={formData.message_body}
            onChange={handleChange}
            required
            rows={10}
          />
        </div>
        <div>
          <label htmlFor="call_to_action_url" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Call to Action URL</label>
          <Input
            id="call_to_action_url"
            name="call_to_action_url"
            value={formData.call_to_action_url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="call_to_action_text" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Call to Action Text</label>
          <Input
            id="call_to_action_text"
            name="call_to_action_text"
            value={formData.call_to_action_text}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader className="animate-spin h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Sending...</p>
          </div> : 'Send Bulk Email'}
        </Button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}

