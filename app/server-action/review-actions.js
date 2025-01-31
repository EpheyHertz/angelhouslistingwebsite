'use server'
import { api } from '../lib/api/server';
// import {getAuthHeaders} from './token-action'
export async function getReviews(propertyId) {
    try {
      const response = await api.get(`/houses/${propertyId}/reviews`,
      
      );
  
      if (response.status !== 200) {
        throw new Error("Unable to fetch reviews");
      }
    
      return await response.data;
    } catch (error) {
      console.error("Get Reviews Error:", error);
      return [];
    }
  }
  
  // Add a new review for a property
  export async function addReview(reviewData) {

    try {
      const response = await api.post(`/reviews/`,
        reviewData
      );
     
  
      if (response.status !==201) {
        throw new Error("Unable to add review");
      }
  
      return {'success':true,'data':response.data} ;
    } catch (error) {
      console.error("Add Review Error:", error);
     return {'success':false,'data':error}
    }
  }