'use server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BASE_URL } from '../../utils/config';
import { api } from '../lib/api/server';


export async function getCartItems() {


  const res = await api.get(`/houses/cart`, {
  });

  if (res.status !==200) {
    const errorData = await res.data;
    throw new Error(errorData.message || "Failed to fetch cart items.");
  }

  const data = await res.data;
  return  {success:true ,data}; // Return the list of cart items
}


export async function addToCart(houseId) {
 const house_id=houseId
  const res = await api.post(`/houses/cart/add`, 
 {house_id}
  );

  if (res.status !==200) {
    const errorData = await res.data;
    throw new Error( errorData.message || "Failed to add item to cart.");
  }

  const data = await res.data;
  return {success:true ,data}; // Optionally return the updated cart or success response
}




export async function removeFromCart(cartId) {

  const res = await api.delete(`/houses/cart/remove/${cartId}`);

  if (res.status !==204) {
    const errorData = await res.data;
    throw new Error(errorData.message || "Failed to remove item from cart.");
  }

  const data = await res.data;
  return {success:true ,data};; // Optionally return the updated cart or success response
}

