import { NextResponse } from 'next/server';
import { api } from '../../../lib/api/server';

// Handle POST requests for processing payments
export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, currency, token,name,email,city } = body;
    console.log('Payment request:', body);

    // Validate required fields
    if (!amount || !currency || !token) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required payment information' },
        { status: 400 }
      );
    }
    // const intAmount = parseInt(amount)
    // Send request to FastAPI backend
    const response = await api.post('/payments/process-payment/', {
      amount,
      name,
      email,
      city,
      currency,
      token,
    });

    // Return response
    return NextResponse.json(
      { status: 'success', data: response.data },
      { status: response.status }
    );

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { status: 'error', message: error.response?.data?.message || 'Failed to process payment request' },
      { status: 500 }
    );
  }
}
