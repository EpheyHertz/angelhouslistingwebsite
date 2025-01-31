import { NextResponse } from 'next/server'
import {api} from '../../../lib/api/server'
export async function POST(req) {
  try {
    const { email } = await req.json()

    const response = await api.post(`/users/password-reset`, {
      body: JSON.stringify({ email }),
    })

    if (response.status !==200) {
      const errorData = await response.data
      return NextResponse.json({ error: errorData.message || 'Failed to initiate password reset' }, { status: response.status })
    }

    return NextResponse.json({ message: 'Password reset email sent successfully' })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

