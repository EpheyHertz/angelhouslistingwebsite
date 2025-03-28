import { NextResponse } from 'next/server';
import { api } from '../../../../lib/api/server';

// Handle PayPal order capture
export async function POST(req) {
    try {
      const body = await req.json();
      // console.log('PayPal Order Capture Request Body:', body);
      const { 
        orderID, 
        email,
        payer_id,
        payment_id
      } = body;
  
      console.log('PayPal Order Capture Request:', body);
  
      // Validate required fields
      if (!orderID || !email) {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Missing required order capture information' 
          },
          { status: 400 }
        );
      }
  
      // Send request to FastAPI backend to capture the order
      const response = await api.post('/payments/paypal/capture-order/', {
        order_id: orderID,
        email: email,
        payer_id: payer_id,
        payment_id: payment_id
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
      console.error('PayPal Order Capture Error:', error);
      return NextResponse.json(
        { 
          status: 'error', 
          message: error.response?.data?.message || 'Failed to capture PayPal order' 
        },
        { status: 500 }
      );
    }
  }