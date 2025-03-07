'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from "../../../components/Layout"
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader, Upload, User, Mail, Lock, Home, MapPin, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import axios from 'axios'
import { BASE_URL } from '@/utils/config'


const backgroundImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
]

const SignupForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [currentBg, setCurrentBg] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: '',
    state: '',
    address: '',
    zipcode: '',
    phoneNumber: '',
    profilePicture: null,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const sortedCountries = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sortedCountries);
    };

    const bgInterval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);

    fetchCountries();
    return () => clearInterval(bgInterval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, profilePicture: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({ ...prev, country: selectedCountry }));

    const country = countries.find((c) => c.name.common === selectedCountry);
    setCountryCode(country ? country.idd.root + country.idd.suffixes[0] : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
  
    // Validate required fields
    const requiredFields = [
      'username',
      'email',
      'password',
      'confirmPassword',
      'firstName',
      'lastName',
      'country',
      'state',
      'address',
      'zipcode',
      'phoneNumber'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError('Please fill in all fields.');
        return;
      }
    }
  
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post('/apis/auth/signup', formData);
  
      if (response.status === 201) {
        setIsLoading(false);
        router.push('/auth/login'); // Redirect on success
      } else {
        setIsLoading(false);
        setError(response.data.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      setIsLoading(false);
      
      // Handle specific HTTP errors
      if (error.response) {
        const status = error.response.status;
        let errorMessage = 'An unexpected error occurred.';
  
        if (status === 400) {
          errorMessage = 'Invalid request. Please check your inputs.';
        } else if (status === 422) {
          errorMessage = 'Validation failed. Please ensure all fields are correct.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
  
        setError(errorMessage);
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };
  
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));


  return (
    <Layout title="Sign Up | House Listing Platform">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((img, index) => (
            <motion.div
              key={img}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentBg === index ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <Image
                src={img}
                alt="Property background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-gray-900/70" />
            </motion.div>
          ))}
        </div>
       
        {/* Signup Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
          
            {/* Progress Steps */}
            <div className="flex justify-center mb-8 space-x-4">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                    ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {s}
                  </div>
                  {s < 2 && <div className={`w-12 h-1 transition-colors ${step >= s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode='wait'>
              <motion.form
                key={step}
                initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
                transition={{ duration: 0.3 }}
                onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
                className="space-y-6"
              >
                {/* Step 1: Account Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="relative group">
                      <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                      <input
                        className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="relative group">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                      <input
                        className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Email address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="relative group">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <div className="relative group">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.confirmPassword}
                        name="confirmPassword"
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-500"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Info */}
                {step === 2 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="relative group">
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                        <input
                          className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative group">
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                        <input
                          className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative group">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                        <select
                          className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                          name="country"
                          value={formData.country}
                          onChange={handleCountryChange}
                          required
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.cca3} value={country.name.common}>
                              {country.name.common}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="relative group">
                        <Home className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                        <input
                          className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="State/Province"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative group">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                        <input
                          className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Street Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative group">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                        <input
                          className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Zip Code"
                          name="zipcode"
                          value={formData.zipcode}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative group">
                        <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-3.5 group-hover:text-blue-500 transition-colors" />
                        <div className="flex gap-2">
                          <input
                            className="w-24 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={countryCode}
                            readOnly
                          />
                          <input
                            className="flex-1 px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Profile Picture */}
                {/* {step === 3 && (
                  <div className="flex flex-col items-center space-y-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer"
                    >
                      <label className="block w-full h-full">
                        {previewImage ? (
                          <Image
                            src={previewImage}
                            alt="Profile Preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </motion.div>

                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      Upload a profile picture to help others recognize you
                    </p>
                  </div>
                )} */}
              </motion.form>
            </AnimatePresence>

            {/* Form Controls */}
            <div className="mt-8 flex justify-between items-center">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </motion.button>
              )}
              
              {step < 2 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center gap-2 transition-all"
                  onClick={nextStep}
                  disabled={isLoading}
                >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                  className="ml-auto px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg flex items-center gap-2 disabled:from-green-200  disabled:to-blue-300"
                  onClick={handleSubmit}
                  type="submit"
                  
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin w-5 h-5" />
                     Creating Account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </motion.button>
              )}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Social Login */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg flex items-center justify-center gap-2 transition-transform"
                onClick={() => window.location.href = `${BASE_URL}auth/google`}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                Continue with Google
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default SignupForm