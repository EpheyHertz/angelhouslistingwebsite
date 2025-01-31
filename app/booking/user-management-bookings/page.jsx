/* eslint-disable no-unused-vars */
'use client';
import { useAuth } from '@/hooks/hooks';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, User, Calendar, Bed, Users, Tag, MessageSquare, Star, Search, Filter, DollarSign, Wallet, Loader, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Rating } from '@smastrom/react-rating';
import axios from 'axios';
import Link from 'next/link';
import '@smastrom/react-rating/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import TabButton from '@/components/TabButton';
import { fetchUserHousesBookings,cancelBookingById,approveBookingById } from '@/app/server-action/booking-actions';

import Layout from '@/components/Layout';


const BookingDashboard = () => {
  const {user}=useAuth()
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [paymentDetails,setPaymentDetails]=useState({})
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    let isMounted = true; // ✅ Avoids state updates on unmounted components
  
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserHousesBookings();
        if (!response || !response.success) {
          toast.error(response?.data || 'Failed to fetch bookings');
          return;
        }
        if (isMounted) setBookings(response.data); // ✅ Only update if component is mounted
      } catch (error) {
        if (isMounted) toast.error(error.message || 'Failed to fetch bookings');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
  
    fetchBookings();
  
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, []);
  

  const filteredBookings = useMemo(() => {
    if (!bookings.length) return [];
  
    return bookings.filter(booking => {
      const matchesSearch = booking?.user?.full_name?.toLowerCase().includes(searchQuery?.toLowerCase() || '');
      const matchesStatus = selectedStatus ? booking?.status === selectedStatus : true;
  
      const startDate = booking.start_date ? new Date(booking.start_date) : null;
      const endDate = booking.end_date ? new Date(booking.end_date) : null;
  
      if (!startDate || !endDate) return false; // Avoid errors
  
      const matchesMonth = startDate <= endOfMonth(selectedMonth) && endDate >= startOfMonth(selectedMonth);
      
      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [bookings, searchQuery, selectedMonth, selectedStatus]);
  

  const calendarColumns = Array.from({ length: 7 }, (_, i) =>
    format(new Date().setDate(new Date().getDate() - new Date().getDay() + i), 'EEE')
  );

  const calendarDates = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  }, [selectedMonth]);

  const handleReviewSubmit = async () => {
    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast.error('Please provide a valid rating (1-5)');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.error('Please provide a comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await axios.post(`/api/bookings/${selectedBookingId}/reviews`, reviewForm);
      setBookings(prev =>
        prev.map(booking =>
          booking.id === selectedBookingId
            ? { ...booking, reviews: [...(booking.reviews || []), response.data] }
            : booking
        )
      );
      toast.success('Review submitted successfully');
      setReviewForm({ rating: 0, comment: '' });
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // const handleCancelBooking = async (bookingId) => {
  //   const result = await cancelBookingById(bookingId);
    
  //   if (result.success) {
  //     toast.success(result.message);
  //     // Update UI state
  //     setBookings(prev =>
  //       prev.map(booking =>
  //         booking.id === bookingId ? { 
  //           ...booking, 
  //           status: 'CANCELLED',
  //           updatedAt: new Date().toISOString() // Add update timestamp
  //         } : booking
  //       )
  //     );
  //     setSelectedBookingId(null); // Close the modal
  //   } else {
  //     toast.error(result.message);
  //     // Handle error in UI (if needed)
  //   }
  // };
  
  // const handleApproveBooking = async (bookingId) => {
  //   const result = await approveBookingById(bookingId);
    
  //   if (result.success) {
  //     toast.success(result.message);
  //     // Update UI state
  //     setBookings(prev =>
  //       prev.map(booking =>
  //         booking.id === bookingId ? { 
  //           ...booking, 
  //           status: 'CONFIRMED',
  //           updatedAt: new Date().toISOString(), // Add update timestamp
  //           confirmedAt: new Date().toISOString() // Add confirmation timestamp
  //         } : booking
  //       )
  //     );
  //     setSelectedBookingId(null); // Close the modal
  //   } else {
  //     toast.error(result.message);
  //     // Handle error in UI (if needed)
  //   }
  // };
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
  
    setIsCancelling(true);
    try {
      const result = await cancelBookingById(bookingId);
      if (!result.success) throw new Error(result.message);
  
      toast.success(result.message);
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { 
            ...booking, 
            status: 'canceled', 
            updatedAt: new Date().toISOString() 
          } : booking
        )
      );
      setSelectedBookingId(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCancelling(false); // ✅ Ensures it's called only once
    }
  };
  
  
  const handleApproveBooking = async (bookingId) => {
    setIsApproving(true)
    const result = await approveBookingById(bookingId);
    setIsApproving(false)
    if (result.success) {
      toast.success(result.message);
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { 
            ...booking, 
            status: 'approved',
            updatedAt: new Date().toISOString(),
            confirmedAt: new Date().toISOString() 
          } : booking
        )
      );
      setSelectedBookingId(null); // Close the modal
      setIsApproving(false)
    } else {
      toast.error(result.message);
      setIsApproving(false)
    }
  };

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  return (
    <Layout title='Manage bookings'>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold dark:text-white">Booking Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
  options={[
    { value: 'pending', label: 'PENDING' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'CANCELLED' },
  ]}
  placeholder="Filter by status"
  className="react-select-container"
  classNamePrefix="react-select"
  onChange={(option) => setSelectedStatus(option?.value)}
  styles={{
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgb(243 244 246)' : 'rgb(255 255 255)', // light mode
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // blue focus border
      borderRadius: '0.5rem',
      padding: '0.5rem',
      transition: 'border-color 0.2s',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.5)' : 'none',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'rgb(255 255 255)', // Light mode menu
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '0.5rem',
    }),
    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected ? 'rgb(59 130 246)' : isFocused ? 'rgb(229 231 235)' : 'white',
      color: isSelected ? 'white' : 'black',
      cursor: 'pointer',
      padding: '0.5rem',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6b7280', // Placeholder color
    }),
  }}
/>


              <DatePicker
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                className="react-datepicker dark:bg-gray-800 rounded-lg"
              />
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Booking Calendar</h2>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {calendarColumns.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDates.map(date => (
                <div
                  key={date.toISOString()}
                  className={`p-2 rounded-lg text-center ${
                    filteredBookings.some(booking =>
                      isSameDay(date, new Date(booking.start_date))
                    ) ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {format(date, 'd')}
                </div>
              ))}
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : filteredBookings?.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 dark:text-gray-400">No bookings found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredBookings.map(booking => (
                <motion.div
                  key={booking?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow p-4 cursor-pointer"
                  onClick={() => setSelectedBookingId(booking?.id)}
                >
                  <div className="flex gap-4">
                    <img 
                      src={booking?.house?.images?.[0] || '/placeholder-house.jpg'}
                      alt="House"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium dark:text-white">{booking?.house?.title}</h3>
                          <div className="mt-1 space-y-1">
                            <Link 
                              href={`/profile/${booking?.user?.id}`}
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <User className="h-4 w-4" />
                              {booking?.user?.full_name}
                            </Link>
                            <Link 
                              href={`/profile/${booking?.user?.id}`}
                              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {booking?.user?.email}
                            </Link>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking?.status === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' :
                            booking?.status === 'CANCELLED' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' :
                            'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                          }`}>
                            {booking?.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {format(booking?.start_date, 'MMM dd')} - {format(booking?.end_date, 'MMM dd')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

        <AnimatePresence>
          {selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBookingId(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedBookingId(null)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>

                <div className="p-6 space-y-4">
                  <div className="flex gap-2">
                    <TabButton key="details" tab="details" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)}>
                      <Calendar className="h-5 w-5" />
                      Details
                    </TabButton>
                    <TabButton key="payment" tab="payment" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)}>
                      <Wallet className="h-5 w-5" />
                      Payment
                    </TabButton>
                    <TabButton key="reviews" tab="reviews" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)}>
                      <Star className="h-5 w-5" />
                      Reviews
                    </TabButton>
                  </div>

                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <img 
                            src={selectedBooking?.house?.images?.[0] || '/placeholder-house.jpg'}
                            alt="House"
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-xl font-semibold dark:text-white">{selectedBooking?.house.title}</h3>
                            <div className="mt-1 space-y-1">
                              <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold">Booking Owner:</p>
                              <Link 
                                href={`/profile/${selectedBooking?.user?.id}`}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                              >
                                <User className="h-4 w-4" />
                                {selectedBooking?.user?.full_name}
                              </Link>
                              <Link 
                                href={`/profile/${selectedBooking?.user?.id}`}
                                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 hover:underline"
                              >
                                {selectedBooking?.user?.email}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                          <div className="flex items-center gap-2">
                            {selectedBooking?.status === 'approved' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : selectedBooking?.status === 'canceled' ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Loader className="h-5 w-5 text-yellow-500 animate-spin" />
                            )}
                            <span className="font-medium dark:text-white capitalize">{selectedBooking?.status}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Price:</p>
                          <p className="font-medium dark:text-white">${selectedBooking?.total_price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Dates:</p>
                          <p className="font-medium dark:text-white">
                            {format(selectedBooking?.start_date, 'MMM dd, yyyy')} - {format(selectedBooking?.end_date, 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Guests:</p>
                          <p className="font-medium dark:text-white">{selectedBooking?.guest_count}</p>
                        </div>
                      </div>

                      {selectedBooking?.house?.owner_id === user?.id && (
      <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleCancelBooking(selectedBooking.id)}
          disabled={isCancelling || selectedBooking.status === 'canceled'}
          className={`flex-1 bg-red-600 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedBooking.status === 'canceled' 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-red-700'
          }`}
        >
          {isCancelling
    ? "Cancelling"
    : selectedBooking.status === "canceled"
    ? "Booking Cancelled"
    : "Cancel Booking"}
        </button>

        <button
          onClick={() => handleApproveBooking(selectedBooking.id)}
          disabled={isApproving||selectedBooking.status === 'approved'}
          className={`flex-1 bg-green-600 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedBooking.status === 'approved' 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-green-700'
          }`}
          
        >
          {isApproving
    ? "Approving"
    : selectedBooking.status === "approved"
    ? "Booking Approved"
    : "Approved Booking"}
        </button>
      </div>
    )}
    </div>
                  )}
                         {/* Complete Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 dark:text-white">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>${selectedBooking.total_price * 0.8}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${selectedBooking.total_price * 0.2}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${selectedBooking.total_price}</span>
                </div>
              </div>
            </div>

            {paymentDetails?<div className="space-y-2">
              <h4 className="font-semibold dark:text-white">Payment History</h4>
               {paymentDetails?.transactions?.map((payment, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center gap-2">
                    {payment.status === 'PAID' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : payment.status === 'FAILED' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Loader className="h-4 w-4 text-yellow-500 animate-spin" />
                    )}
                    <span>{format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>${payment.amount}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'PAID' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' :
                      payment.status === 'FAILED' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}:''
              {!paymentDetails?.transactions?.length && (
                <p className="text-gray-500 dark:text-gray-400">No payment history available</p>
              )}
            </div>:''}
          </div>
        )}

        {/* Complete Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {selectedBooking.reviews?.length > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <Rating
                    value={
                      selectedBooking.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                      selectedBooking.reviews.length
                    }
                    readOnly
                    style={{ maxWidth: 150 }}
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    ({selectedBooking.reviews.length} reviews)
                  </span>
                </div>
                {selectedBooking.reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{review.rating}/5</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        by {review.user?.full_name || 'Anonymous'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
            )}

            {selectedBooking.status === 'COMPLETED' && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold dark:text-white">Write a Review</h4>
                <textarea
                  placeholder="Share your experience..."
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                />
                <div className="flex items-center gap-4">
                  <Rating
                    value={reviewForm.rating}
                    onChange={(value) => setReviewForm({ ...reviewForm, rating: value })}
                    style={{ maxWidth: 150 }}
                  />
                  <button
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    onClick={handleReviewSubmit}
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Update the owner approval section in details tab */}
        {/* {selectedBooking?.house?.owner_id === user?.id  && (
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleStatusChange(selectedBooking.id, 'CANCELLED')}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              disabled={selectedBooking.status === 'CANCELLED'}

            >
              Cancel Booking
            </button>
            <button
              onClick={() => handleStatusChange(selectedBooking.id, 'CONFIRMED')}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              disabled={selectedBooking.status === 'CONFIRMED'}
            >
              Confirm Booking
            </button>
          </div>
        )} */}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default BookingDashboard;