'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OwnercancelBookingById, fetchBookingById } from "../app/server-action/booking-actions";
import { Loader2, CheckCircle, XCircle, Clock, Building, Home, Users, Calendar, MessageSquare, ArrowLeft, Star, Map, DollarSign } from "lucide-react";
import Link from "next/link";
import ComplaintForm from "./conset";
import { useAuth } from '../hooks/hooks';
import Image from "next/image";
import toast from "react-hot-toast";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02, transition: { duration: 0.3 } }
};

const quoteVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } }
};

export default function BookingDetails({ bookingId }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState("");
  const [openConsent, setOpenConsent] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isCancelling, setCancelling] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchBooking(bookingId);
  }, [bookingId]);

  const fetchBooking = async (bookingId) => {
    try {
      setLoading(true);
      const response = await fetchBookingById(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError("Failed to fetch booking data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      const response = await OwnercancelBookingById(bookingId);
      if (response.success) {
        toast.success(response.message, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#4ade80',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
        setActionStatus('canceled');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking', {
        duration: 3000,
        position: 'top-center',
        style: {
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    } finally {
      setCancelling(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "canceled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "canceled":
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <Loader2 className="animate-spin h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto" />
          <p className="text-center mt-6 text-xl font-medium text-gray-700 dark:text-gray-200">Loading Your Booking...</p>
          <p className="text-center mt-2 text-gray-500 dark:text-gray-400">Please wait while we fetch your booking details</p>
        </div>
      </div>
    );

  if (error) 
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md">
          <XCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto" />
          <p className="text-center mt-6 text-xl font-medium text-gray-700 dark:text-gray-200">Something went wrong</p>
          <p className="text-center mt-2 text-gray-500 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (actionStatus === "deleted") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto" />
          <p className="text-center mt-6 text-2xl font-bold text-gray-800 dark:text-white">Booking Deleted Successfully</p>
          <p className="text-center mt-2 text-gray-600 dark:text-gray-300">Your booking has been successfully deleted from our system.</p>
          <Link href="/my-bookings">
            <button className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-300">
              Back to My Bookings
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80)' }}>
      <div className="backdrop-blur-sm bg-gradient-to-b from-black/40 to-black/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/my-bookings" className="inline-flex items-center gap-2 text-white hover:text-blue-200 transition mb-6">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to My Bookings</span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Hero Section */}
            <div className="relative h-96">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 overflow-hidden"
              >
                <Image
                  src={booking?.house?.image_urls[activeImage] || ''}
                  alt={booking?.house?.title || 'Property Image'}
                  priority
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold mb-2"
                >
                  {booking?.house?.title}
                </motion.h1>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-4 mb-4"
                >
                  <div className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    <span className="text-sm">{booking?.house?.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">{booking?.house?.rating || '4.9'} ({booking?.house?.reviews || '42'} reviews)</span>
                  </div>
                </motion.div>

                <motion.div
                  variants={quoteVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 max-w-xl"
                >
                  <p className="text-xl font-medium italic text-gray-100">"Adventure is worthwhile in itself"</p>
                  <p className="text-sm text-gray-300">- Amelia Earhart</p>
                </motion.div>
              </div>

              {/* Image Navigation */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {booking?.house?.image_urls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${activeImage === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Status Badge */}
            <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(booking?.status)}`}>
                  {getStatusIcon(booking?.status)}
                  <span className="capitalize">{booking?.status}</span>
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Booking ID: {bookingId}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Booking Details */}
                  <motion.div 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        Booking Details
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300">Check-in</p>
                              <p className="text-gray-900 dark:text-white text-lg">{new Date(booking?.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300">Guests</p>
                              <p className="text-gray-900 dark:text-white text-lg">{booking?.guest_count} {booking?.guest_count === 1 ? 'guest' : 'guests'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300">Check-out</p>
                              <p className="text-gray-900 dark:text-white text-lg">{new Date(booking?.end_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                              </div>
                          </div>


<div className="flex items-start gap-4">
  <Home className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
  <div>
    <p className="font-medium text-gray-700 dark:text-gray-300">Rooms</p>
    <p className="text-gray-900 dark:text-white text-lg">{booking?.room_count} {booking?.room_count === 1 ? 'room' : 'rooms'}</p>
  </div>
</div>
</div>
</div>

<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
<div className="flex items-start gap-4">
<DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
<div>
  <p className="font-medium text-gray-700 dark:text-gray-300">Pricing Information</p>
  <div className="mt-2 space-y-2">
    <div className="flex justify-between text-gray-600 dark:text-gray-400">
      <span>Nightly rate</span>
      <span>${booking?.house?.price_per_night || '0'} × {booking?.nights || '0'} nights</span>
    </div>
    <div className="flex justify-between text-gray-600 dark:text-gray-400">
      <span>Cleaning fee</span>
      <span>${booking?.house?.cleaning_fee || '0'}</span>
    </div>
    <div className="flex justify-between text-gray-600 dark:text-gray-400">
      <span>Service fee</span>
      <span>${booking?.house?.service_fee || '0'}</span>
    </div>
    <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
      <span>Total</span>
      <span>${booking?.total_price || '0'}</span>
    </div>
  </div>
</div>
</div>
</div>
</div>
</motion.div>

{/* Special Requests */}
<motion.div 
variants={itemVariants}
initial="hidden"
animate="visible"
className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl overflow-hidden shadow-lg"
>
<div className="p-6">
<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
<MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
Special Requests
</h2>
<div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 shadow-inner">
<p className="text-gray-700 dark:text-gray-300 italic">
{booking?.special_request ? (
  booking.special_request
) : (
  <span className="text-gray-500 dark:text-gray-400">No special requests made for this booking.</span>
)}
</p>
</div>
</div>
</motion.div>

{/* Photos Gallery */}
<motion.div 
variants={itemVariants}
initial="hidden"
animate="visible"
className="rounded-2xl overflow-hidden shadow-lg"
>
<div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700/50 dark:to-gray-800/50">
<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Property Gallery</h2>
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
{booking?.house?.image_urls.map((url, idx) => (
<motion.div
  key={idx}
  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
  onClick={() => setActiveImage(idx)}
  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md"
>
  <Image
    src={url}
    alt={`Property Image ${idx + 1}`}
    fill
    sizes="(max-width: 768px) 50vw, 33vw"
    className="object-cover transition-transform duration-300 hover:scale-110"
  />
  {activeImage === idx && (
    <div className="absolute inset-0 border-4 border-blue-500 rounded-xl pointer-events-none" />
  )}
</motion.div>
))}
</div>
</div>
</motion.div>
</div>

{/* Sidebar - 1 column */}
<div className="space-y-8">
{/* Property Details */}
<motion.div 
variants={itemVariants}
initial="hidden"
animate="visible"
className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl overflow-hidden shadow-lg"
>
<div className="p-6">
<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
<Building className="h-6 w-6 text-teal-600 dark:text-teal-400" />
Property Overview
</h2>

<Link href={`/house/${booking?.house?.id}?id=${booking?.house?.id}`} className="group">
<div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-sm mb-4 transition-all hover:shadow-md">
<div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
  <Image 
    src={booking?.house?.image_urls[0] || ''} 
    alt={booking?.house?.title}
    width={64}
    height={64}
    className="w-full h-full object-cover"
  />
</div>
<div>
  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
    {booking?.house?.title}
  </h3>
  <p className="text-sm text-gray-500 dark:text-gray-400">
    Click to view property details
  </p>
</div>
</div>
</Link>

<div className="space-y-4 mt-6">
<div className="flex justify-between items-center text-gray-700 dark:text-gray-300 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
<span>Type:</span>
<span className="font-medium">{booking?.house?.property_type || 'Not specified'}</span>
</div>
<div className="flex justify-between items-center text-gray-700 dark:text-gray-300 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
<span>Bedrooms:</span>
<span className="font-medium">{booking?.house?.bedrooms || booking?.room_count || '0'}</span>
</div>
<div className="flex justify-between items-center text-gray-700 dark:text-gray-300 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
<span>Bathrooms:</span>
<span className="font-medium">{booking?.house?.bathrooms || '0'}</span>
</div>
<div className="flex justify-between items-center text-gray-700 dark:text-gray-300 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
<span>Max guests:</span>
<span className="font-medium">{booking?.house?.max_guests || booking?.guest_count || '0'}</span>
</div>
</div>
</div>
</motion.div>

{/* Amenities */}
<motion.div 
variants={itemVariants}
initial="hidden"
animate="visible"
className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl overflow-hidden shadow-lg"
>
<div className="p-6">
<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Featured Amenities</h2>
<div className="grid grid-cols-1 gap-3">
{(booking?.house?.amenities || []).map((amenity, idx) => (
<motion.div
  key={idx}
  whileHover={{ x: 5, transition: { duration: 0.2 } }}
  className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-sm"
>
  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
  <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
</motion.div>
))}
</div>
</div>
</motion.div>

{/* Actions Card */}
<motion.div 
variants={itemVariants}
initial="hidden"
animate="visible"
className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl overflow-hidden shadow-lg sticky top-4"
>
<div className="p-6">
<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Booking Actions</h2>

<div className="space-y-4">
{booking?.status !== 'canceled' ? (
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={handleCancel}
  disabled={isCancelling}
  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
>
  {isCancelling ? (
    <>
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Processing...</span>
    </>
  ) : (
    <>
      <XCircle className="h-5 w-5" />
      <span>Cancel Booking</span>
    </>
  )}
</motion.button>
) : (
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => setOpenConsent((prev) => !prev)}
  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg transition-all"
>
  <MessageSquare className="h-5 w-5" />
  <span>{openConsent ? "Close Appeal Form" : "Submit an Appeal"}</span>
</motion.button>
)}

<Link href={`/house/${booking?.house?.id}?id=${booking?.house?.id}`}>
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all"
>
  <Building className="h-5 w-5" />
  <span>View Property Details</span>
</motion.button>
</Link>
</div>

<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
<p className="text-gray-600 dark:text-gray-400 text-sm text-center italic">
"The journey of a thousand miles begins with a single step"
</p>
</div>
</div>
</motion.div>
</div>
</div>
</div>
</motion.div>

{/* Appeal Form */}
<AnimatePresence>
{openConsent && (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
className="mt-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
>
<div className="p-6 border-b border-gray-200 dark:border-gray-700">
<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Submit an Appeal</h2>
<p className="text-gray-600 dark:text-gray-400 mt-1">Please provide details about why you'd like to appeal this cancellation</p>
</div>
<div className="p-6">
<ComplaintForm 
houseTitle={booking?.house?.title} 
bookingId={booking?.id} 
house_id={booking?.house?.id} 
user={user}
/>
</div>
</motion.div>
)}
</AnimatePresence>
</div>
</div>
</div>
);
}