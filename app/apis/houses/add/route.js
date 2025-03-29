import { NextResponse } from "next/server";
import { api } from "../../../lib/api/server";

export async function POST(request) {
  try {
    const formData = await request.formData();

    // ✅ Parse JSON `houseData`

    const houseData = JSON.parse(formData.get("houseData"));
   
    // ✅ Reconstruct FormData properly
    const formattedFormData = new FormData();

    // ✅ Append each field individually (FastAPI requires separate form fields)
    Object.entries(houseData).forEach(([key, value]) => {
      formattedFormData.append(key, value);
    });

    // ✅ Append images correctly
    const images = formData.getAll("images"); // Get all uploaded images
    images.forEach((image) => {
      formattedFormData.append("images", image);
    });

    // ✅ Send to FastAPI using `multipart/form-data`
    // console.log("Full Data to Backend", formattedFormData);

    const response = await api.post("/houses/", formattedFormData);

    if (response.status !== 201) {
      return NextResponse.json(
        { success: false, message: `Failed to add house. Status: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, data: response.data.house, message: "House created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in addUserHouse:", error);

    return NextResponse.json(
      { success: false, message: error.message || "An unknown error occurred", status: 500 },
      { status: 500 }
    );
  }
}
