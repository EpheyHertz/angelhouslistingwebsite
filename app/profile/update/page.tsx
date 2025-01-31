'use client'
import Layout from '../../../components/Layout';
import { User, MapPin, Phone, Camera, Loader } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/hooks';
import { updateProfile } from '@/app/server-action/profile-actions';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};


export default function ProfileUpdate() {
  const { isAuthenticated, user: authUser } = useAuth();

  const [user, setUser] = useState(authUser);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setUser(authUser);
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Correct destructuring
    setUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
    console.log(user)
  };

  
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
  
    const formData = new FormData();
    
    // Append all relevant fields dynamically from the user object
    if (user?.full_name) formData.append('full_name', user.full_name);
    if (user?.location) formData.append('location', user.location);
    if (user?.phone_number) formData.append('phone', String(user.phone_number));
    if (user?.address) formData.append('address', String(user.address));
    if (user?.zipcode) formData.append('zipcode', String(user.zipcode));
    if (user?.country) formData.append('country', user.country);
    if (user?.state) formData.append('state', user.state);
    // if (user?.contact_number) formData.append('phone_number', user.phone_number);
    if (user?.first_name) formData.append('first_name', user.first_name);
    if (user?.last_name) formData.append('last_name', user.last_name);
  
    // Append profile picture if available
    if (newProfilePicture) {
      formData.append('profile_picture', newProfilePicture);
    }
  
    try {
      const response = await updateProfile(formData); // Assuming updateProfile is the function to update the user profile
      setUser(response)
      console.log('Updated user data:', response);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };
  

  return (
    <Layout title="Update Profile | House Listing Platform">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            Update Your Profile
          </motion.h1>

          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 backdrop-blur-sm border border-white/20"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <form onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <motion.div 
                className="mb-8"
                whileHover={{ scale: 1.01 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Profile Picture
                </label>
                <div className="flex items-center gap-6">
                  <motion.div 
                    className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg"
                    whileHover={{ rotate: 2, scale: 1.05 }}
                  >
                    <Image
                      src={previewUrl || user?.profile_image || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full transform transition duration-300 hover:scale-110"
                    />
                  </motion.div>
                  <motion.label 
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="inline-block mr-2" size={18} />
                    Change Picture
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </motion.label>
                </div>
              </motion.div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { id: 'name', name: 'full_name', label: 'Full Name', icon: User },
                  { id: 'first_name', name: 'first_name', label: 'First Name', icon: User },
                  { id: 'last_name', name: 'last_name', label: 'Last Name', icon: User },
                  { id: 'address', name: 'address', label: 'Address', icon: MapPin, type: 'number' },
                  { id: 'zipcode', name: 'zipcode', label: 'Zip Code', icon: MapPin, type: 'number' },
                  { id: 'state', name: 'state', label: 'State', icon: MapPin },
                  { id: 'country', name: 'country', label: 'Country', icon: MapPin },
                  { id: 'location', name: 'location', label: 'Location', icon: MapPin },
                  { id: 'phone_number', name: 'phone_number', label: 'Phone', icon: Phone, type: 'tel' },
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover="hover"
                  >
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                        <field.icon className="h-5 w-5" />
                      </div>
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        id={field.id}
                        value={user?.[field.name as keyof typeof user] || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </motion.div>
                ))}

                {/* Email Field */}
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.9 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={user?.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-70"
                >
                  {updating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
