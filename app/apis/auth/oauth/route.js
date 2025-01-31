import { NextResponse } from 'next/server'
import {api} from '../../../lib/api/server'

export async function GET(req) {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  const accessToken = authHeader.split(' ')[1]

  try {
    const response = await api.get(`/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (response.status !==200) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await response.data
    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
}

