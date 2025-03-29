import { NextResponse } from "next/server";
import { api } from "../../../lib/api/server";

export async function POST(request) {
  try {
    const houseData = await request.json();

    // Validate houseData exists
    if (!houseData) {
      return NextResponse.json(
        { 
          success: false,
          message: "House data cannot be empty" 
        },
        { status: 400 }
      );
    }

    const response = await api.post(`/houses/`, houseData);

    // Check if the response status is not 201 (Created)
    if (response.status !== 201) {
      return NextResponse.json(
        { 
          success: false,
          message: `Failed to add house. Status: ${response.status}` 
        },
        { status: response.status }
      );
    }

    // Ensure the response contains data
    if (!response.data || !response.data.house) {
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid or empty response from server." 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data.house,
        message: response.data.message || "House created successfully",
        status: 201,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in addUserHouse:", error);

    // Check for Axios response error (server error)
    if (error.response) {
      return NextResponse.json(
        {
          success: false,
          message: error.response.data?.detail || `Server error: ${error.response.statusText}`,
          status: error.response.status,
        },
        { status: error.response.status }
      );
    }

    // Handle network errors
    if (error.request) {
      return NextResponse.json(
        {
          success: false,
          message: "No response from server. Please check your internet connection.",
          status: 503,
        },
        { status: 503 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unknown error occurred",
        status: 500,
      },
      { status: 500 }
    );
  }
}