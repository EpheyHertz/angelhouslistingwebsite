'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OwnercancelBookingById, fetchBookingById } from "../app/server-action/booking-actions";
import { Loader2, CheckCircle, XCircle, Clock, Building, Home, Users, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import ComplaintForm from "./conset";
import { useAuth } from '../hooks/hooks';
import Image from "next/image";
import toast from "react-hot-toast";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02 }
};

const quoteVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

export default function BookingDetails({ bookingId }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState("");
  const [openConsent, setOpenConsent] = useState(false);
  const [status,setStatus]=useState('pending')
  const [isCancelling,setCancelling]=useState(false)
  const {user}=useAuth()

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

  const handleUpdate = () => {
    setActionStatus("update");
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?'))return;
    setCancelling(true)
    try {
      const response=await OwnercancelBookingById(bookingId);
      if(response.success){
        toast.success(response.message,{
          duration:3000,
          position: 'top-center',
          style: {
            background: '#4ade80', // Green
            color: '#fff',
            fontWeight: 'bold',
          },
        })
        setActionStatus('canceled')
      }
    
     
    } catch (err) {
      toast.error(response.message || 'Failed to cancel booking',{
        duration:3000,
        position: 'top-center',
        style: {
          color: '#fff',
          fontWeight: 'bold',
        },
      })
    }finally{
      setCancelling(false)
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


  if (loading)
    return (
      <div className="flex flex-col justify-center align-middle w-full h-auto">
        <Loader2 className="animate-spin h-10 w-10 mt-10 text-blue-500 align-middle justify-center" />
        <p className="text-center mt-10 text-lg font-medium">Loading Booking Data...</p>
      </div>
    );

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (actionStatus === "deleted") {
    return <p className="text-center mt-10 text-green-600 font-semibold">Booking successfully deleted.</p>;
  }

  if (actionStatus === "update") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl font-medium text-gray-700 dark:text-gray-200">Redirecting to update page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80)' }}>
      <div className="backdrop-blur-sm bg-black/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
          >
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Booking Details
            </motion.h1>

            {/* Hero Section */}
            <motion.div 
              className="mb-8 relative group overflow-hidden rounded-xl"
              whileHover="hover"
              variants={itemVariants}
            >
              <Image
                src={booking.house.image_urls[0]}
                alt={booking.house.title}
                width={1200}
                height={600}
                className="w-full h-96 object-cover rounded-xl transform transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 rounded-xl" />
              <div className="absolute bottom-6 left-6">
                <motion.p 
                  variants={quoteVariants}
                  className="text-xl font-medium text-white"
                >
                  "Adventure is worthwhile in itself"
                </motion.p>
                <p className="text-gray-200 text-sm">- Amelia Earhart</p>
              </div>
            </motion.div>

            {/* Image Gallery */}
            <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {booking.house.image_urls.map((url, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: idx * 0.1 }}
                  className="relative group overflow-hidden rounded-lg"
                >
                  <Image
                    src={url}
                    alt={`House Image ${idx + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transform transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <motion.div 
                  variants={itemVariants}
                  className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-900 rounded-xl"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Booking Overview</h2>
                  <div className="space-y-4">
                    <Link href={`/house/${booking.house.id}?id=${booking.house.id}`} className="block">
                      <motion.div 
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-4 p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <Building className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Property</p>
                          <p className="text-gray-600 dark:text-gray-400">{booking.house.title}</p>
                        </div>
                      </motion.div>
                    </Link>

                    {[
                      { icon: Home, label: "Rooms", value: booking.room_count },
                      { icon: Users, label: "Guests", value: booking.guest_count },
                      { 
                        icon: Calendar, 
                        label: "Dates", 
                        value: `${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}` 
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="flex items-center gap-4 p-3"
                      >
                        <item.icon className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                          <p className="text-gray-600 dark:text-gray-400">{item.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Status Card */}
                <motion.div
                  variants={itemVariants}
                  className={`p-6 rounded-xl border-l-4 ${getStatusStyles(booking.status)}`}
                >
                  <div className="flex items-center gap-4">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">Booking Status</p>
                      <p className="text-lg font-semibold capitalize">{booking.status}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Special Requests */}
                <motion.div 
                  variants={itemVariants}
                  className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-900 rounded-xl"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <MessageSquare className="text-blue-500" /> 
                    Special Requests
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    {booking.special_request || "No special requests made for this booking."}
                  </p>
                </motion.div>

                {/* Amenities */}
                <motion.div 
                  variants={itemVariants}
                  className="p-6 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-gray-700 dark:to-gray-900 rounded-xl"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Featured Amenities</h2>
                  <ul className="grid grid-cols-2 gap-4">
                    {booking.house.amenities.map((amenity, idx) => (
                      <motion.li
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg shadow-sm"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Action Section */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Need to make changes?
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    "The journey of a thousand miles begins with a single step"
                  </p>
                </div>
                
                <div className="flex gap-4">
                  {booking?.status !== 'canceled' ? (
                  ''
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpenConsent((prev) => !prev)}
                      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-lg hover:bg-purple-700 transition"
                    >
                      {openConsent ? "Close Appeal" : "Send An Appeal"}
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-lg hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
                  >
                    {isCancelling?"Cancelling Booking":'Cancel Booking'}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {openConsent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ComplaintForm 
                    houseTitle={booking.house.title} 
                    bookingId={booking.id} 
                    house_id={booking.house.id} 
                    user={user}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}