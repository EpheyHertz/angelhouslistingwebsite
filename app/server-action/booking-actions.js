'use server'

import { api } from '../lib/api/server';
import  axios  from 'axios';

// Fetch all bookings for the current user
export async function getBookings() {
  try {
    const response = await api.get(`/houses/user/bookings`);

    if (!response.ok) {
      throw new Error("Unable to fetch bookings");
    }

    return await response.data;
  } catch (error) {
    console.error("Get Bookings Error:", error);
    return [];
  }
}

// Create a new booking
export async function createBooking(bookingData) {
  try {
    // Log the bookingData before sending it to make sure it's correct
    // console.log(bookingData);

    // Ensure the house_id is an integer, guest_count is an integer, and dates are in the correct format
    const formattedBookingData = {
      ...bookingData,
      house_id: parseInt(bookingData.house_id, 10),  // Ensure house_id is an integer
      guest_count: parseInt(bookingData.guest_count, 10),  // Ensure guest_count is an integer
      start_date: new Date(bookingData.start_date).toISOString(),  // Ensure correct datetime format
      end_date: new Date(bookingData.end_date).toISOString(),  // Ensure correct datetime format
    };
    

    // Send the formatted booking data
    try {
      const response = await api.post(`/houses/book`, {...formattedBookingData});

    if (response.status !==200) {
      throw new Error("Unable to create booking");
    }

    return { success: true, data: response.data };
    } catch (error) {
      console.error("Create Booking Error:", error);
    return { success: false, message: `Create Booking Error: ${error}` };
    }
    
  } catch (error) {
    console.error("Create Booking Error:", error);
    return { success: false, message: `Create Booking Error: ${error}` };
  }
}









export const fetchBookings = async () => {
  const response = await api.get(`/houses/user/bookings`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return await response.data;
};





export const fetchBookingById = async (bookingId) => {
  const response = await api.get(`/houses/bookings/${bookingId}`);
  if (response.status !== 200) throw new Error('Failed to fetch booking');
  return  {'success':true,'data':response.data};
};

export const fetchUserHousesBookings = async () => {
  const response = await api.get(`/houses/user/bookings`);
  if (response.status == 404) return {'success':true,'data':[]};
  if (response.status !== 200) throw new Error('Failed to fetch booking');
  return  {'success':true,'data':response.data};
};

export const cancelBookingById = async (bookingId) => {
  try {
    const response = await api.post(`/houses/booking/house_owner/cancel/${bookingId}`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to cancel booking. Server responded with status: ${response.status}`);
    }

    return {
      success: true,
      message: response.data.message || 'Booking cancelled successfully',
      data: response.data
    };
  } catch (error) {
   
    
    let errorMessage = 'Failed to cancel booking';
    if (error.response) {
      // Handle HTTP errors
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Handle network errors
      errorMessage = 'Network error - No response received from server';
    }

    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
};


export const OwnercancelBookingById = async (bookingId) => {
  try {
    const response = await api.post(`/houses/booking/cancel/${bookingId}`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to cancel booking. Server responded with status: ${response.status}`);
    }

    return {
      success: true,
      message: response.data.message || 'Booking cancelled successfully',
      data: response.data
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    
    let errorMessage = 'Failed to cancel booking';
    if (error.response) {
      // Handle HTTP errors
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Handle network errors
      errorMessage = 'Network error - No response received from server';
    }

    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
};

export const approveBookingById = async (bookingId) => {
  try {
    const response = await api.post(`/houses/bookings/${bookingId}/approve`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to approve booking. Server responded with status: ${response.status}`);
    }

    return {
      success: true,
      message: response.data.message || 'Booking approved successfully',
      data: response.data
    };
  } catch (error) {
   
    
    let errorMessage = 'Failed to approve booking';
    if (error.response) {
      // Handle HTTP errors
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Handle network errors
      errorMessage = 'Network error - No response received from server';
    }

    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
};

export const updateBooking = async (bookingId, status) => {
  const response = await api.put(`/houses/update_booking/${bookingId}`, {

    data:JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update booking');
  return {'success':true,message:response.data};
};



export async function submitAppeal({ bookingId, house_id, name, email, message }) {
  try {
      // Ensure required fields are not empty before making the request
      if (!bookingId || !house_id || !email || !message.trim()) {
          throw new Error("All fields are required");
      }

      const response = await api.post("/houses/submit-appeal", {
          bookingId,
          house_id,
          name,
          email,
          message,
      });

      if (response?.data?.success) {
          return { success: true };
      } else {
          throw new Error(response?.data?.message || "Unexpected response from server");
      }
  } catch (error) {
      // Handle different error cases
      if (axios.isAxiosError(error)) {
          return {
              success: false,
              error:
                  error.response?.data?.detail ||
                  error.response?.data?.message ||
                  "A server error occurred. Please try again.",
          };
      } else {
          return { success: false, error: error.message || "An unexpected error occurred." };
      }
  }
}