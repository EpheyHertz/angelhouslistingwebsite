'use server'

import { api } from "../lib/api/server"

export async function submitContactForm(formData) {
  try {
    const response = await api.post(`/users/contact`, {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    })

    if (response.status !== 200) {
      return { message: response.data.detail || 'Submission failed', success: false }
    }

    return { message: 'Message sent successfully!', success: true }
  } catch (error) {
    console.error('Submission error:', error)
    return { message: 'Network error. Please try again.', success: false }
  }
}
