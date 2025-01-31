'use server'
import { api } from '../lib/api/server';
// Fetch latest properties
export async function getLatestProperties() {
  try {
    const response = await api.get(`/houses/`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Unable to fetch latest properties");
    }

    return await response.data;
  } catch (error) {
    console.error("Get Latest Properties Error:", error);
    return [];
  }
}

// Fetch properties with filters
export async function getProperties({ filter, query, limit }) {
  try {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (query) params.append("query", query);
    if (limit) params.append("limit", limit);

    const response = await api.get(`/houses/?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Unable to fetch properties");
    }

    return await response.data;
  } catch (error) {
    console.error("Get Properties Error:", error);
    return [];
  }
}

// Fetch property by ID
export async function getPropertyById(id) {
  try {
    const response = await api.get(`/houses/house/${id}?house_id=${id}`,{});
   
    if (response.status !==200) {
      throw new Error("Unable to fetch property");
    }

    return await response.data;
  } catch (error) {
    console.error("Get Property by ID Error:", error);
    return null;
  }
}
export async function deletePropertyById(id) {
  try {
    const response = await api.delete(`/houses/${id}`,{});
  
    if (response.status !==204) {
      throw new Error("Unable to delete property");
    }
    
    return {success:true,message:'House deleted Successfully'};
  } catch (error) {
    console.error("Get Property by ID Error:", error);
    return {success:false,message:'An error occured please try again later!'};
  }
}
export async function getUserHousesById(id) {

  try {
    const response = await api.get(`/houses/${id}/houses`,{});
  
    if (response.status !==200) {
      throw new Error("Unable to fetch property");
    }

    return await response.data;
  } catch (error) {
    console.error("Get Property by ID Error:", error);
    return null;
  }
}
export async function updateUserHousesById(updateData, house_id) {
  // Validate input parameters
  if (!updateData) {
    throw new Error("Update data cannot be empty");
  }
  
  if (!house_id) {
    throw new Error("House ID is required");
  }

  try {
   

    // Use PATCH method instead of POST to match your backend route
    const response = await api.patch(`/houses/${house_id}`, updateData);

    if (!response.data) {
      throw new Error("Empty response from server");
    }

   
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'House updated successfully'
    };

  } catch (error) {
   

    // Handle Axios-specific errors
    if (error.response) {
      // Server responded with non-2xx status
      const serverMessage = error.response.data?.detail || error.response.statusText;
      return {
        success: false,
        message: `Server error: ${serverMessage}`,
        status: error.response.status
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: "No response from server. Please check your network connection."
      };
    } else {
      // Other errors
      return {
        success: false,
        message: error.message || "Failed to update house"
      };
    }
  }
}
export async function addUserHouse(houseData) {
  // Validate input parameters
  if (!houseData) {
    throw new Error("Update data cannot be empty");
  }

  try {
   

    // Process data to ensure numerical values
    const response = await api.post(`/houses/`, houseData);

    if (response.status !== 201) {
      throw new Error(`Failed to add House. Status code: ${response.status}`);
    }

    if (!response.data) {
      throw new Error("Empty response from server");
    }

   
    return {
      success: true,
      data: response.data.house,
      message: response.data.message || "House created successfully",
    };

  } catch (error) {
   

    // Enhanced error handling for numerical conversion
    if (error.message.includes("invalid number") || error.message.includes("numeric value")) {
      return {
        success: false,
        message: "Invalid numerical value in form data",
        status: 400
      };
    }

    // Handle Axios-specific errors
    if (error.response) {
      const serverMessage = error.response.data?.detail || error.response.statusText;
      return {
        success: false,
        message: `Server error: ${serverMessage}`,
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        message: "No response from server. Please check your network connection.",
      };
    } else {
      return {
        success: false,
        message: error.message || "Failed to create house",
      };
    }
  }
}