import { api } from '../../../../../lib/api/server';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ success: false, message: "Checkout request ID is required" }, { status: 400 });
    }

    // Forward request to FastAPI backend
    const response = await api.post('/mpesa/query-stk-status/', { checkout_request_id: id });

    return Response.json(response.data, { status: response.status });

  } catch (error) {
    console.error("M-Pesa Status Check Error:", error.response?.data || error.message);

    // Extract the FastAPI error message
    const errorMessage = error.response?.data?.detail || "Payment status check failed";

    return Response.json(
      {
        success: false,
        message: errorMessage, // Display FastAPI's specific error message
      },
      { status: error.response?.status || 500 }
    );
  }
}
