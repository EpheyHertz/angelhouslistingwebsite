import { NextResponse } from "next/server";
import { api } from "../../../lib/api/server";

export async function GET() {
  try {
    const response = await api.get(`/houses/get/user/houses`);

    // Handle successful response
    if (response.status === 200) {
      // console.log(response.data)
      const houses=response.data
      return NextResponse.json({ status: response.status, houses });
    }
    if (response.status === 422) {
      return NextResponse.json({ status: response.status, message: 'Failed to fetch houses' });
    }

    // Handle unexpected status codes
    return NextResponse.json(
      {
        status: response.status,
        error: "Unexpected response status from the server.",
      },
      { status: response.status }
    );
  } catch (error) {
    // Error handling based on Axios error structure
    if (error.response) {
      // Server responded with a status other than 2xx
      return NextResponse.json(
        {
          status: error.response.status,
          error: error.response.data.detail || "An error occurred while fetching houses.",
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      // No response received from server
      return NextResponse.json(
        {
          status: 503,
          error: "No response from the server. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      {
        status: 500,
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

