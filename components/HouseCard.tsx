'use client';

import { Heart, Edit, Trash, HouseIcon, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import profileimage from '../public/user.png';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {addToCart} from '@/app/server-action/cart-actions'
import { deletePropertyById } from '@/app/server-action/house_actions';

interface HouseCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  amenities?: string[];
  imageUrl: string; // New property for a single image
  image_urls: string[];
  owner_id: number; // Owner's ID
  likeCount: number; // Number of likes
  bathrooms: number;
  room_count: number;
  userId: number; // Current logged-in user's ID
  owner: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    contact_number: string | null;
    location: string | null;
    profile_image: string | null;
    role: 'regular_user' | 'admin' | 'house_owner';
    is_verified: boolean;
    verification_status: string;
    phone_number: number;
    created_at: string;
    updated_at: string | null;
  };
  onDelete: (id: number) => void;
  reviews: {
    reviewerId: number;
    reviewerName: string;
    rating: number;
    comment: string;
  }[]; // Array of reviews
  [key: string]: unknown; // To handle any other dynamic fields
}

export default function HouseCard({
  id,
  title,
  location,
  price,
  imageUrl,
  image_urls,
  room_count,
  likeCount,
  bedrooms,
  bathrooms,
  owner_id,
  userId,
  onDelete,
  owner,
}: HouseCardProps) {
  const router = useRouter();
  const [isInCart, setIsInCart] = useState(() => {
    // Initialize state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`cart_${id}`);
      return saved === 'true';
    }
    return false;
  });

  const isOwner = userId === owner_id; // Check if the current user is the owner

  const handleDelete = async() => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      try {
      const response= await deletePropertyById(id);
      if(!response.success){
        toast.error(`Error occured deleting house:${response.message}`,{
          duration:3000,
        })
      }else{
        toast.success(`${response.message}`,{
          duration:3000,
        })
      }
      } catch (error) {
        toast.error(`Un expected error occured:${error}`,{
          duration:3000,
        })
        
      }
      
    }
  };

  const handleCartToggle = async () => {
    try {
      const response= await addToCart(id);
      if (!response || !response.success){
        toast.error('Failed to add to cart! Try again later!');
      }
      toast.success('Added to cart! 🛒');
      const newState = !isInCart;
    setIsInCart(newState);
    // Update localStorage
    localStorage.setItem(`cart_${id}`, newState.toString());
    // Show appropriate toast
    toast.success(newState ? 'Added to cart! 🛒' : 'Removed from cart! ❌');
    } catch (error) {
      toast.error('Failed to add to cart',error);
    }
    
  };

  const mainImage = imageUrl || (image_urls.length > 0 ? image_urls[0] : '/fallback-image.jpg');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <Image
        src={mainImage}
        alt={title}
        width={400}
        height={300}
        priority
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>

          {/* Profile Section */}
          {!isOwner && (
            <div className="flex items-center space-x-3">
              <Link
                href={`/profile/${owner?.id || owner?.user_id}`}
                className="flex items-center space-x-2 hover:underline"
              >
                {/* Profile Picture */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={owner?.profile_image || profileimage}
                    alt={`${owner?.full_name}'s profile picture`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    objectFit="cover"
                  />
                </div>
                {/* Username */}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {owner?.username}
                </span>
              </Link>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{location}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${price}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{likeCount}</span>
            </div>
            <div className="flex items-center">
              <HouseIcon className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{room_count}</span>
            </div>
            {!isOwner && (
              <button
                onClick={handleCartToggle}
                className="flex items-center transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md"
              >
                {isInCart ? (
                  <X className="h-5 w-5 text-red-500" />
                ) : (
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
          <span>
            {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
          </span>
          <span>
            {bathrooms} {bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
          </span>
        </div>

        {isOwner && (
          <div className="flex space-x-3 mb-4">
            <Link href={`/houses/${id}?${id}`} className="text-blue-500 hover:text-blue-600">
              <Edit className="h-5 w-5" />
            </Link>
            <button onClick={handleDelete} className="text-red-500 hover:text-red-600">
              <Trash className="h-5 w-5" />
            </button>
          </div>
        )}

        <button
          onClick={() => router.push(`/houses/${id}/?id=${id}`)}
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
}