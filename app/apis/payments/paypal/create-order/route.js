import { NextResponse } from 'next/server';
import { api } from '../../../../lib/api/server';

// Handle PayPal order creation
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      amount, 
      currency, 
      name, 
      email, 
      description,
      billingAddress 
    } = body;

    // console.log('PayPal Order Creation Request:', body);

    // Validate required fields
    if (!amount || !currency || !name || !email) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Missing required order creation information' 
        },
        { status: 400 }
      );
    }

    // Send request to FastAPI backend for order creation
    const response = await api.post('/payments/paypal/create-order/', {
      amount,
      currency,
      name,
      email,
      description: description || 'Payment',
      billing_address: billingAddress || {}
    });

    // Return response
    return NextResponse.json(
      { 
        status: 'success', 
        data: response.data 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PayPal Order Creation Error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.response?.data?.message || 'Failed to create PayPal order' 
      },
      { status: 500 }
    );
  }
}