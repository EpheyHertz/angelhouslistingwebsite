'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Edit2, Home } from 'lucide-react';
import ShareHouse from './ShareHouse'; // Adjust path as needed

// Animation variants
const animationVariants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
};

// Action button component
const ActionButton = ({ icon: Icon, label, count, active, onClick }) => (
  <motion.button
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
        : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    {count !== undefined && <span>{count}</span>}
    {label && <span>{label}</span>}
  </motion.button>
);

// Price display component
const PriceDisplay = ({ currency, price }) => (
  <motion.div
    className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 260 }}
  >
    {currency || 'Kes'} {price.toLocaleString()}
  </motion.div>
);

// Main component
const HousePriceActions = ({ house, user, comments, initialLikedState = false, setIsEditing, router }) => {
  // Manage state internally rather than expecting props
  const [liked, setLiked] = useState(initialLikedState);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Generate action buttons based on user role and house data
  const getActionButtons = () => {
    const baseActions = [
      {
        icon: Heart,
        count: house.likeCount + (liked ? 1 : 0),
        onClick: () => setLiked(!liked),
        active: liked
      },
      { 
        icon: MessageCircle, 
        count: comments.length 
      },
      { 
        icon: Share2, 
        label: 'Share',
        onClick: () => setShowShareModal(true) 
      }
    ];
    
    // Add edit button if user is the owner
    if (user?.id === house.owner.id) {
      baseActions.push({ 
        icon: Edit2, 
        label: 'Edit', 
        onClick: () => setIsEditing(true) 
      });
    } 
    // Add booking button if user is not the owner
    else {
      baseActions.push({
        icon: Home,
        label: 'Book Now',
        onClick: () => router.push(`/booking/house-book/${house.id}`)
      });
    }
    
    return baseActions;
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      variants={animationVariants.container}
      initial="hidden"
      animate="show"
    >
      <PriceDisplay currency={house.currency} price={house.price} />

      <div className="flex flex-wrap gap-2">
        {getActionButtons().map((action, index) => (
          <ActionButton
            key={index}
            icon={action.icon}
            count={action.count}
            label={action.label}
            active={action.active}
            onClick={action.onClick}
          />
        ))}
      </div>
      
      {/* ShareHouse component from imported file */}
      {showShareModal && (
        <div className="modal-overlay">
          <ShareHouse 
            houseId={house?.id} 
            title={house?.title}
            image={house?.images[0]}
            variant="floating" 
            onClose={() => setShowShareModal(false)}
          />
        </div>
      )}
    </motion.div>
  );
};

export default HousePriceActions;