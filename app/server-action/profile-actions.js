'use server'
import { api } from '../lib/api/server';

export const fetchProfile = async (id) => {
  const response = await api.get(`/users/profile/${id}`);
  if (response.status !==200) throw new Error('Failed to fetch profile');
 
  return await response.data;
};
export const fetchUserProfile = async () => {
  const response = await api.post(`/users/profile`, );
  if (response.status !==200) throw new Error('Failed to fetch profile');
  return await response.data;
};

export const updateProfile = async (profileData) => {
  

  
  
    try {
      // Send a PUT request with the FormData object
      const response = await api.put(`/users/update_profile`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
    
      if (response.status !== 200) throw new Error('Failed to update profile');
      return await response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  