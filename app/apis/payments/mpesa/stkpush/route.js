import {api} from '../../../../lib/api/server';

export async function POST(request) {
  try {
    const payload = await request.json();
    
    // Forward the request to your FastAPI backend
    const response = await api.post(
      `/mpesa/initiate-payment/`, 
      payload
    );
    
    // Return the response from the backend
    return Response.json(response.data);
    
  } catch (error) {
    console.error("M-Pesa STK Push Error:", error.response?.data || error.message);
    
    // Forward error from backend or create a generic error message
    return Response.json(
      { 
        success: false, 
        message: error.response?.data?.message || "Payment initiation failed", 
        error: error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}