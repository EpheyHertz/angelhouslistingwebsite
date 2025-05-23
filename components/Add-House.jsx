'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ImagePlus, X, Wand2, Landmark, BedDouble, ShowerHead, Loader, Mail, Phone, Globe, Linkedin, MessageCircle, Facebook, CreditCard, Phone as PhoneIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import StripeTokenCheckout from './stripe';
import MpesaPayment from './Mpesa';
import PayPalTokenCheckout from './Paypal';
import useExchangeRate from '../hooks/useExchangeRate';
import {compressToUnder1MB} from '../utils/imgCompressor';
const listingQuotes = [
  "A house is made of walls and beams; a home is built with love and dreams.",
  "Great spaces are born from great visions",
  "Your perfect home is waiting to be shared"
];

const COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES', phoneCode: '+254' }
];

const LISTING_FEE_KES = 500; // Fixed listing fee in KES

export default function AddHousePage() {
  const router = useRouter();
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentQuote] = useState(listingQuotes[Math.floor(Math.random() * listingQuotes.length)]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStep, setPaymentStep] = useState('form');
  const [transactionId, setTransactionId] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Load draft from localStorage if exists
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('propertyDraft');
      return savedData ? JSON.parse(savedData) : {
        title: '',
        description: '',
        price: '',
        deposit: '',
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
        facebook: '',
        transaction_id: ''
      };
    }
    return {
      title: '',
      description: '',
      price: '',
      deposit: '',
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
      facebook: '',
      transaction_id: ''
    };
  });

  // Exchange rate handling
  const { rate, loading: rateLoading } = useExchangeRate();
  const USD_TO_KES_RATE = rate || 133;
  const listingFeeUSD = (LISTING_FEE_KES / USD_TO_KES_RATE).toFixed(2);

  // Save draft to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('propertyDraft', JSON.stringify(formData));
    }
  }, [formData]);

  const MAX_IMAGE_SIZE_MB = 0.9; // 900KB with buffer
  const MAX_IMAGE_WIDTH = 1200; // More aggressive width reduction
  
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
  
    // Initial size check
    const oversizedFiles = files.filter(file => file.size > 4 * 1024 * 1024); // 5MB
    if (oversizedFiles.length > 0) {
      toast.error(`Some files are too large (max 5MB initially). Please select smaller files.`);
      return;
    }
  
    const toastId = toast.loading(`Compressing ${files.length} image(s)...`);
  
    try {
      const compressionResults = await Promise.allSettled(
        files.map(file => compressToUnder1MB(file))
      );
  
      const successful = [];
      const failed = [];
  
      compressionResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const compressedFile = result.value;
          successful.push({
            url: URL.createObjectURL(compressedFile),
            file: compressedFile,
            originalSize: files[index].size,
            compressedSize: compressedFile.size
          });
        } else {
          failed.push({
            name: files[index].name,
            error: result.reason.message
          });
        }
      });
  
      setPreviewImages(prev => [...prev, ...successful]);
  
      toast.dismiss(toastId);
      
      if (successful.length > 0) {
        const totalSaved = successful.reduce(
          (sum, img) => sum + (img.originalSize - img.compressedSize), 0
        );
        toast.success(
          `Added ${successful.length} images (saved ${(totalSaved/1024/1024).toFixed(1)}MB)`,
          { duration: 3000 }
        );
      }
  
      if (failed.length > 0) {
        failed.forEach(({ name, error }) => {
          toast.error(`${name}: ${error}`, { duration: 5000 });
        });
      }
  
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(`Error processing images: ${error.message}`);
    }
  };
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setPaymentStep('payment');
  };
  const removeImage = (index) => {
    setPreviewImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(index, 1);
      URL.revokeObjectURL(removed.url); // Clean up memory
      return newImages;
    });
  };

  const handlePaymentSuccess = (data) => {
    setTransactionId(data.transaction_id);
    setFormData(prev => ({ ...prev, transaction_id: data.transaction_id }));
    setPaymentStep('confirmation');
    toast.success('Payment successful!', {
      autoClose: 3000,
      position: 'top-right',
    });
    
    // Clear draft after successful payment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('propertyDraft');
    }
  };

  const handlePaymentCancel = () => {
    setPaymentStep('form');
    setPaymentMethod('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.transaction_id) {
      setError("Please complete payment before publishing your listing");
      toast.error("Payment required", { autoClose: 3000, position: "top-right" });
      return;
    }
  
    // Check individual image sizes (1MB limit per image)
    const oversizedImages = previewImages.filter(
      img => img.file.size > 1 * 1024 * 1024
    );
  
    if (oversizedImages.length > 0) {
      toast.error(
        `${oversizedImages.length} images exceed 1MB limit. Please remove them.`,
        { duration: 5000 }
      );
      return;
    }
  
    // Check total combined size (4.2MB limit for all images)
    const totalSizeMB = previewImages.reduce(
      (sum, img) => sum + img.file.size, 0
    ) / (1024 * 1024);
  
    if (totalSizeMB > 4.2) {
      toast.error(
        `Total images size ${totalSizeMB.toFixed(1)}MB exceeds 4.2MB limit. Please remove some images.`,
        { duration: 5000 }
      );
      return;
    }
  
    setIsSubmitting(true);
    setError("");
  
    try {
      const formPayload = new FormData();
      formPayload.append('houseData', JSON.stringify(formData));
  
      previewImages.forEach(({ file }, index) => {
        formPayload.append(`images`, file, `image-${Date.now()}-${index}.${file.name.split('.').pop()}`);
      });
  
      const response = await fetch("/apis/houses/add", {
        method: "POST",
        body: formPayload,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      router.push(`/houses/${data.data.id}`);
      toast.success("House created successfully");
  
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to create listing");
      toast.error(err.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderContent = () => {
    switch (paymentStep) {
      case 'form':
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            setPaymentStep('paymentSelection');
          }} className="space-y-8">
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
                  Deposit (KES)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">KES</span>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    className="w-full pl-14 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter deposit"
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
                  <option value="single_room">Single Room</option>
                  <option value="one_bedroom">One Bedroom</option>
                  <option value="two_bedroom">Two Bedroom</option>
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
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center"
              >
                <Landmark className="h-5 w-5 mr-2" />
                Continue to Payment
              </button>
            </div>
          </form>
        );
      
      case 'paymentSelection':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Choose Payment Method</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              A listing fee of KES {LISTING_FEE_KES} (≈ ${listingFeeUSD} USD) applies to publish your property.
            </p>
            {rateLoading ? (
              <p className="text-center">Loading exchange rate...</p>
            ) : (
              <p className="text-center text-sm text-gray-500">
                Current rate: 1 USD ≈ {USD_TO_KES_RATE} KES
              </p>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handlePaymentMethodSelect('mpesa')}
                className="p-6 border-2 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all flex flex-col items-center space-y-4"
              >
                <PhoneIcon className="h-10 w-10 text-green-600" />
                <h3 className="text-xl font-bold">M-Pesa</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Pay directly using your M-Pesa mobile money
                </p>
                <div className="font-medium text-green-600">
                  KES {LISTING_FEE_KES}
                </div>
              </button>
              
              <button
                onClick={() => handlePaymentMethodSelect('paypal')}
                className="p-6 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center space-y-4"
              >
                <CreditCard className="h-10 w-10 text-blue-600" />
                <h3 className="text-xl font-bold">PayPal</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Pay using PayPal or credit/debit card
                </p>
                <div className="font-medium text-blue-600">
                  ${listingFeeUSD} USD
                </div>
              </button>
              
              <button
                onClick={() => handlePaymentMethodSelect('stripe')}
                className="p-6 border-2 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all flex flex-col items-center space-y-4"
              >
                <CreditCard className="h-10 w-10 text-purple-600" />
                <h3 className="text-xl font-bold">Card Payment</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Pay securely using credit or debit card
                </p>
                <div className="font-medium text-purple-600">
                  KES {LISTING_FEE_KES}
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setPaymentStep('form')}
              className="w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Back to Form
            </button>
          </div>
        );
      
      case 'payment':
        return (
          <div className="space-y-6">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Property Summary</h3>
              <p><span className="font-medium">Title:</span> {formData.title}</p>
              <p><span className="font-medium">Location:</span> {formData.location}</p>
              <p><span className="font-medium">Type:</span> {formData.type}</p>
              <p><span className="font-medium">Price:</span> KES {formData.price}</p>
            </div>
            
            {paymentMethod === 'mpesa' ? (
              <div>
                <h2 className="text-xl font-bold mb-4">M-Pesa Payment</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  You will receive an M-Pesa push notification to complete payment of KES {LISTING_FEE_KES}.
                </p>
                <MpesaPayment 
                  amount={LISTING_FEE_KES}
                  phoneNumber={`254${formData.phone_number}`}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                  propertyTitle={formData.title}
                />
              </div>
            ) : paymentMethod === 'stripe' ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Card Payment</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Complete payment of KES {LISTING_FEE_KES} using your credit or debit card.
                </p>
                <StripeTokenCheckout 
                  amount={LISTING_FEE_KES} // Convert to cents
                  currency="KES"
                  description={`Listing fee for ${formData.title}`}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">PayPal Payment</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Complete payment of ${listingFeeUSD} USD (≈ KES {LISTING_FEE_KES}) using PayPal.
                </p>
                <PayPalTokenCheckout 
                  amount={listingFeeUSD}
                  currency="USD"
                  description={`Listing fee for ${formData.title}`}
                  clientId={process.env.NEXT_PUBLIC_PAYPAL_PUBLISHABLE_KEY}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              </div>
            )}
            
            <button
              onClick={() => setPaymentStep('paymentSelection')}
              className="w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all mt-4"
            >
              Choose Another Payment Method
            </button>
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {paymentMethod === 'mpesa' ? `KES ${LISTING_FEE_KES}` : 
                 paymentMethod === 'paypal' ? `$${listingFeeUSD} USD` : 
                 `KES ${LISTING_FEE_KES}`} payment received.
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg inline-block">
                <p className="font-medium">Transaction ID:</p>
                <p className="font-mono text-lg">{transactionId}</p>
              </div>
            </div>
            
            <div className="border-t pt-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg animate-shake">
                  {error}
                </div>
              )}
              <button
                onClick={handleSubmit}
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
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inspiration Sidebar */}
          <div className="hidden lg:block relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl h-fit top-8">
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
              
              {paymentStep !== 'form' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mt-6">
                  <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2">Listing Process</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li className={paymentStep === 'form' ? 'font-bold text-blue-600' : 'text-gray-600'}>Fill property details</li>
                    <li className={paymentStep === 'paymentSelection' ? 'font-bold text-blue-600' : 'text-gray-600'}>Choose payment method</li>
                    <li className={paymentStep === 'payment' ? 'font-bold text-blue-600' : 'text-gray-600'}>Complete payment</li>
                    <li className={paymentStep === 'confirmation' ? 'font-bold text-blue-600' : 'text-gray-600'}>Publish your listing</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
              <Home className="h-8 w-8 text-blue-500" />
              List Your Property
              {paymentStep !== 'form' && (
                <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 py-1 px-3 rounded-full ml-2">
                  {paymentStep === 'paymentSelection' ? 'Payment Selection' : 
                   paymentStep === 'payment' ? 'Processing Payment' : 
                   'Confirmation'}
                </span>
              )}
            </h1>
            {error && <h1 className='text-red-600 text-xl text-center mb-4'>{error}</h1>}

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}