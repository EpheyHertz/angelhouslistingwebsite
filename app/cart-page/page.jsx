'use client';

import { Trash, ShoppingCart, Home } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Layout from '../../components/Layout';
import {getCartItems,removeFromCart} from '../server-action/cart-actions'
import { Loader2 } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    setError('')
    setLoading(true)
    const fetchCartItems=async()=>{
        const response=await getCartItems();
        if (!response.success){
             setError(response.data||'An error occurred while fetching cart')
             setLoading(false)
        }
        setLoading(false)
        setCartItems(response.data);
        
    }

    fetchCartItems();
   
  }, []);

  const handleRemoveFromCart =async (id) => {
    setError('')
    try {
        const response=await removeFromCart(id);
        if (!response || !response.success){
            setError('Failed to remove from cart! Please try again')
        }
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('housingCart', JSON.stringify(updatedCart));
        toast.success('Removed from cart');
        
    } catch (error) {
        setError(`Error: ${error}`)
    }
   
  };
  if (loading){
    return (
        <Layout title='Fetching your Cart Content'>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          {/* Animated Loader */}
          <div className="relative flex items-center justify-center">
            {/* Outer Circle */}
            <div className="absolute w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            {/* Lucide Loader Icon */}
            <Loader2 className="w-12 h-12 text-blue-500 animate-pulse" />
          </div>
    
          {/* Loading Text */}
          <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Loading Your Cart...
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please wait while we prepare your shopping experience.
          </p>
    
          {/* Optional: Subtle Background Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full opacity-20 animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        </Layout>
      );
  }

  if (cartItems.length === 0) {
    return (
    <Layout title='House Cart Page'>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <ShoppingCart className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Start exploring amazing properties and add them to your cart.
        </p>
        <a
          href="/houses"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
        >
          <Home className="w-5 h-5 mr-2" />
          Browse Properties
        </a>
      </div>
      </Layout>
    );
  }

  return (
    <Layout title='House Cart Page'>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Your Saved Properties ({cartItems.length})
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((property) => (
          <div
            key={property.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={property.imageUrl || 'https://source.unsplash.com/random/800x600?house'}
                alt={property.title}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {property.title}
                </h3>
                <button
                  onClick={() => handleRemoveFromCart(property.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {property.location}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${property?.price.toLocaleString()}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Home className="w-4 h-4 mr-1" />
                    {property?.room_count|| property?.bedrooms }
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-1">🛏</span>
                    {property?.bedrooms}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-1">🚿</span>
                    {property?.bathrooms}
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Added {new Date(property?.added_at).toLocaleDateString()}</span>
                <span>{property?.likeCount||0} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default CartPage;