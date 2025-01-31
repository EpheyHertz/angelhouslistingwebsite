'use client';
import { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createBooking } from '@/app/server-action/booking-actions';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02 },
};

export default function BookingForm({ house_id }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState({
    house_id: house_id,
    start_date: '',
    end_date: '',
    guest_count: 1,
    room_count: 1,
    special_request: '',
    booking_type: 'daily', // Default to 'daily'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]: name === 'guest_count' || name === 'room_count' ? parseInt(value, 10) : value,
    }));
  };

  const validateForm = () => {
    if (!booking.start_date || !booking.end_date) {
      setError('Please select both check-in and check-out dates.');
      return false;
    }
    if (new Date(booking.start_date) >= new Date(booking.end_date)) {
      setError('Check-out date must be after check-in date.');
      return false;
    }
    if (booking.guest_count < 1 || booking.room_count < 1) {
      setError('Guest and room counts must be at least 1.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await createBooking(booking);
      if (response.success) {
        alert('Your booking request has been sent successfully.');
        setBooking({
          house_id: house_id,
          start_date: '',
          end_date: '',
          guest_count: 1,
          room_count: 1,
          special_request: '',
          booking_type: 'daily', // Reset to default
        });
      } else {
        setError(response.message || 'An error occurred! Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('An unexpected error occurred! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?hotel,resort)' }}
    >
      <div className="backdrop-blur-sm bg-black/30 inset-0 absolute"></div>

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="relative max-w-2xl mx-auto space-y-6 p-8 rounded-xl shadow-2xl border border-white/20
                   bg-white/90 text-gray-900 dark:bg-gray-800/90 dark:text-gray-100 
                   backdrop-blur-lg"
      >
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Book Your Stay
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Booking Type Input */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          whileHover="hover"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Booking Type
          </label>
          <select
            id="booking_type"
            name="booking_type"
            value={booking.booking_type}
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl border border-gray-300/50 
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                      dark:bg-gray-700/50 dark:border-gray-600 transition-all"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Inputs */}
          {['start_date', 'end_date'].map((field, idx) => (
            <motion.div
              key={field}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: idx * 0.1 }}
              whileHover="hover"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.includes('start') ? 'Check-in Date' : 'Check-out Date'}
              </label>
              <div className="relative mt-2 group">
                <input
                  type="date"
                  id={field}
                  name={field}
                  value={booking[field]}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300/50 
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                            dark:bg-gray-700/50 dark:border-gray-600 transition-all"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guest and Room Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['guest_count', 'room_count'].map((field, idx) => (
            <motion.div
              key={field}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover="hover"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.includes('guest') ? 'Number of Guests' : 'Number of Rooms'}
              </label>
              <select
                id={field}
                name={field}
                value={booking[field]}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-xl border border-gray-300/50 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                          dark:bg-gray-700/50 dark:border-gray-600 transition-all"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>

        {/* Special Requests */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          whileHover="hover"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Special Requests
          </label>
          <textarea
            id="special_request"
            name="special_request"
            value={booking.special_request}
            onChange={handleChange}
            placeholder="Any special requests or requirements?"
            className="w-full py-3 px-4 rounded-xl border border-gray-300/50 
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                      dark:bg-gray-700/50 dark:border-gray-600 transition-all h-32"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
                      text-white font-medium rounded-xl shadow-lg transition-all 
                      hover:scale-[1.02] disabled:opacity-70 relative"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing Booking...</span>
              </div>
            ) : (
              'Submit Booking Request'
            )}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
}