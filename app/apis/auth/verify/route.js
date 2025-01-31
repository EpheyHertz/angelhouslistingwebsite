import { NextResponse } from 'next/server';

import { api } from '../../../lib/api/server';

export async function POST(request) {
  try {
    const { token, email } = await request.json();

    // Validate inputs
    if (!token || !email) {
      return NextResponse.json({ message: 'Invalid token or email' }, { status: 400 });
    }

    // Construct the backend URL using query parameters
    const backend_url = '/users/verify-email';

   

    // Send GET request with query parameters
    const response = await api.get(backend_url, {
      params: { email, token },
    });

    if (response.status === 200) {
      return NextResponse.json(
        { message: 'Email verified successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: response.data?.message || 'Email verification failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Verification error:', error);

    if (error.response) {
      // Handle backend error responses
      return NextResponse.json(
        { message: error.response.data?.message || 'Verification failed' },
        { status: error.response.status }
      );
    }

    // Handle unexpected errors
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
