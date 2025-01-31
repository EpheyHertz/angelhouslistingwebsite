'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Home, ImagePlus, X, Wand2, Landmark, BedDouble, ShowerHead, Loader, Mail, Phone, Globe, Linkedin, MessageCircle, Facebook } from 'lucide-react'
import {addUserHouse} from '../app/server-action/house_actions'
import { Toaster,toast } from 'react-hot-toast';



const listingQuotes = [
  "A house is made of walls and beams; a home is built with love and dreams.",
  "Great spaces are born from great visions",
  "Your perfect home is waiting to be shared"
]

const COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES', phoneCode: '+254' }
]

export default function AddHousePage() {
  const router = useRouter()
  const [previewImages, setPreviewImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentQuote] = useState(listingQuotes[Math.floor(Math.random() * listingQuotes.length)])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    room_count: 0,
    type: 'apartment',
    amenities: '',
    email: '',
    phone_number: '',
    country: 'Kenya',
    currency: 'KES',
    linkedin: '',
    whatsapp: '',
    facebook: ''
  })

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };
  
  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      previewImages.forEach(({ file }) => formPayload.append("images", file));
  
      const response = await addUserHouse(formPayload);
  
      if (response.success) {
       
        router.push(`/houses/${response.data.id}?id=${response.data.id}`);
        toast.success('House created successfully', {
          autoClose: 3000,
          position: 'top-right',
        });
      }
    } catch (err) {
      
      setError(err.response?.data?.message || response.message || "Failed to create listing");
      toast.error('Failed to create listing', {
        autoClose: 3000,
        position: 'top-right',
      })
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inspiration Sidebar */}
          <div className="hidden lg:block relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl h-fit sticky top-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
                <Wand2 className="h-8 w-8 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Listing Tips</h3>
                <p className="opacity-90">{currentQuote}</p>
              </div>
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                  alt="Home illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              <Home className="h-8 w-8 text-blue-500" />
              List Your Property
            </h1>
            {error?<h1 className='text-red-600 text-3xl text-center'>{error}</h1>:''}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Property Images
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="group relative aspect-square">
                      <img
                        src={preview.url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <ImagePlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Add Photos
                      </span>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price (KES)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">KES</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-14 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="cottage">Cottage</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="bedsitter">BedSitter</option>
                    <option value="single_room">SingLe Room</option>
                    <option value="one_bedroom">One BedRoom</option>
                    <option value="two_bedroom">Two BedRoom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rooms
                  </label>
                  <div className="relative">
                    <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      name="room_count"
                      value={formData.room_count}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amenities (comma separated)
                  </label>
                  <div className="relative">
                    <ShowerHead className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleChange}
                      placeholder="e.g., WiFi, Parking, Pool"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="property@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contact Phone
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                      +254
                    </span>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="700 123 456"
                        pattern="[0-9]{9}"
                        title="9-digit Kenyan phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      name="country"
                      value={formData.country}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                      disabled
                    >
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Social Media Links */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A66C2] h-5 w-5" />
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/username"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    WhatsApp Contact
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366] h-5 w-5" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+254 700 123 456"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Facebook Page
                  </label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1877F2] h-5 w-5" />
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="facebook.com/username"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Section */}
              <div className="border-t pt-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg animate-shake">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <Landmark className="h-5 w-5 mr-2" />
                      Publish Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}