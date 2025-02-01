import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { token, new_password } = await req.json()

    const response = await api.post(`/users/password-reset/confirm?token=${token}`, {
     token, new_password 
    })

    if (!response.ok) {
      const errorData = await response.data
      return NextResponse.json({ error: errorData.message || 'Failed to reset password' }, { status: response.status })
    }

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error) {
    console.error('Password reset confirmation error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}