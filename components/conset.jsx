'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitAppeal } from '../app/server-action/booking-actions';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02 }
};

export default function ComplaintForm({ bookingId, houseTitle, house_id, user }) {
  const [formData, setFormData] = useState({
    name: "",
    email: user.email,
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields have valid data
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error("Name and message are required.");
      return;
    }
    if (!bookingId || !house_id) {
      toast.error("Booking id and the house id are needed.");
      return;
    }
    if (!formData.email) {
      toast.error("Email is required to send the Appeal.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send all required data
      const response = await submitAppeal({
        bookingId,  // Waiting for bookingId
        house_id,   // Waiting for house_id
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      if (response.success) {
        toast.success("Your appeal has been submitted successfully!");
        setFormData({ name: "", email: user.email, message: "" });
      } else {
        throw new Error(response.error || "Submission failed.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit your appeal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div 
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?customer,support)' }}
    >
      <div className="backdrop-blur-sm bg-black/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Submit Appeal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              "Our team is here to help resolve any issues"
            </p>
          </motion.div>

          {/* Information Card */}
          <motion.div
            variants={itemVariants}
            className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 rounded-xl border-l-4 border-blue-500"
          >
            <p className="text-gray-700 dark:text-gray-300">
              Regarding booking for <span className="font-semibold">{houseTitle}</span><br/>
              <span className="text-sm opacity-75">Booking ID: {bookingId}</span>
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Your Name
              </label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                whileHover={{ scale: 1.01 }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300/50 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="John Doe"
              />
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-300/50 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-700/50 cursor-not-allowed italic"
              />
            </motion.div>

            {/* Message Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Your Message
              </label>
              <motion.textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                whileHover={{ scale: 1.01 }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300/50 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Describe your concern in detail..."
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Appeal...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Submit Appeal
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}