"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Layout from './Layout'
import { motion } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share2,
  Bed,
  Bath,
  Square,
  ChevronLeft,
  ChevronRight,
  Star,
  Edit2,
  Home,
  MapPin,
  Loader2,
  User,
  Mail,
  Phone
} from 'lucide-react'
import { api } from '@/app/lib/api/client'
import { addReview, getReviews } from '../app/server-action/review-actions'
import ReviewsAndComments from './review-component'
import { useAuth } from '../hooks/hooks'
import EditHouseDetails from './updateHouse'
import { updateUserHousesById } from '../app/server-action/house_actions'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import axios from 'axios'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
}

export default function HouseDetails({id}) {
  const router = useRouter()
  const searchparams = useSearchParams()
  const { user } = useAuth()

  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [comments, setComments] = useState([])
  const [house, setHouse] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updateError, setUpdateError] = useState(null)
  const [addingReview, setAddingReview] = useState(false)
  const [map, setMap] = useState(null)

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/apis/houses/house/${id}`)
        setHouse(response.data)
        const comments = await getReviews(id)
        setComments(comments)
        setError(null)
      } catch (err) {
        setError(err.message || "Failed to fetch house details.")
      } finally {
        setLoading(false)
      }
    }

    fetchHouse()
  }, [id])
    
    // Handle editing a comment
    const handleEdit = (commentId) => {
      const comment = comments.find((c) => c.id === commentId);
      setNewComment(comment.content);
      setNewRating(comment.rating);
      // Optionally, implement logic to switch to an edit form
    };
  
    // Handle deleting a comment
    const handleDelete = (commentId) => {
      setComments(comments.filter((comment) => comment.id !== commentId));
    };

  const handleLike = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    )
  }

  const handleUpdateHouse = async (updatedData, house_id) => {
    const response = await updateUserHousesById(updatedData, house_id)
    if(response.success){

      setIsEditing(false)
      alert('House updated Successfully')
     
    }else{
      setUpdateError('An error occured while Updating the House!')
    }



   
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    try {
      setAddingReview(true)
      const data = {
        comment: newComment,
        rating: newRating,
        house_id: parseInt(id),
      }
      const response = await addReview(data)
      if (response.success) {
        setNewComment('')
        setNewRating(0)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setAddingReview(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === house.images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? house.images.length - 1 : prevIndex - 1
    )
  }

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Loader2 className="h-12 w-12 text-blue-500" />
          </motion.div>
        </div>
      </Layout>
    )
  }

  if (error) return <Layout title="Error">Error: {error}</Layout>
  if (!house) return <Layout title="Not Found">House not found</Layout>

  return (
    
      <motion.div
        className="max-w-7xl mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1
            className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            {house.title}
          </motion.h1>
          <motion.div
            className="flex items-center text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MapPin className="h-5 w-5 mr-1" />
            {house.location}
          </motion.div>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          className="relative h-96 mb-8 rounded-2xl overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <Image
              src={house.images[currentImageIndex]}
              alt={`${house.title} - Image ${currentImageIndex + 1}`}
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          <motion.button
            onClick={prevImage}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            whileHover={{ scale: 1.1 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
          
          <motion.button
            onClick={nextImage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            whileHover={{ scale: 1.1 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>

          <div className="absolute bottom-4 right-4 bg-black/75 text-white px-3 py-1 rounded-md text-sm">
            {currentImageIndex + 1} / {house.images.length}
          </div>
        </motion.div>

        {/* Price and Actions */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          variants={itemVariants}
        >
          <motion.div
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260 }}
          >
            ${house.price.toLocaleString()}
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {[
              {
                icon: Heart,
                count: house.likeCount + (liked ? 1 : 0),
                action: () => setLiked(!liked),
                active: liked
              },
              { icon: MessageCircle, count: comments.length },
              { icon: Share2, label: 'Share' },
              ...(user?.id === house.owner.id
                ? [{ icon: Edit2, label: 'Edit', action: () => setIsEditing(true) }]
                : []),
              ...(user?.id !== house.owner.id
                ? [{
                    icon: Home,
                    label: 'Book Now',
                    action: () => router.push(`/booking/house-book/${house.id}`)
                  }]
                : [])
            ].map((action, index) => (
              <motion.button
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  action.active
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
              >
                <action.icon className="h-5 w-5" />
                {action.count && <span>{action.count}</span>}
                {action.label && <span>{action.label}</span>}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {[
            { icon: Bed, title: 'Bedrooms', value: house.bedrooms },
            { icon: Bath, title: 'Bathrooms', value: house.bathrooms },
            { icon: Square, title: 'Area', value: `${house.area} sqft` }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <feature.icon className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xl">{feature.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{house.description}</p>
        </motion.div>

        {/* Google Map */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-red-500" />
            Location
          </h2>
          
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: house.latitude, lng: house.longitude }}
                zoom={14}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false
                }}
              >
                <Marker position={{ lat: house.latitude, lng: house.longitude }} />
              </GoogleMap>
            </LoadScript>
          ) : (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  {house.location}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-sm font-mono">Lat:</span>
                  {house.latitude}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-sm font-mono">Lng:</span>
                  {house.longitude}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Amenities */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {house.amenities.map((amenity, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{amenity}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Owner */}
        <motion.div
          className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Owner</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">{house.owner.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">{house.owner.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">{house.owner.phone}</span>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div variants={itemVariants}>
          <ReviewsAndComments
            comments={comments}
            user={user}
            handleCommentSubmit={handleCommentSubmit}
            handleLike={handleLike}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            newComment={newComment}
            setNewComment={setNewComment}
            newRating={newRating}
            setNewRating={setNewRating}
            addingReview={addingReview}
          />
        </motion.div>

        {isEditing && (
          <EditHouseDetails
            house={house}
            setIsEditing={setIsEditing}
            handleUpdateHouse={handleUpdateHouse}
            updateError={updateError}
          />
        )}
      </motion.div>
   
  )
}