"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "./Layout";
import { User, Mail, Phone, Home, Edit, Loader } from "lucide-react";
import HouseCard from "./HouseCard";
import { useAuth } from "../hooks/hooks";
import profileImage from "../public/user.png";
import { fetchProfile } from '../app/server-action/profile-actions';
import { getUserHousesById } from '../app/server-action/house_actions';

export default function OwnerProfile({ id }) {
  const { user } = useAuth();
  const router = useRouter();
  const [owner, setOwner] = useState(null);
  const [ownerHouses, setOwnerHouses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("houses");

  // Unsplash background images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80'
  ];

  const profileQuotes = [
    "Home is where our story begins...",
    "Great homes are made with care and passion",
    "Every house has a story, let yours be legendary"
  ];

  const fetchUserProfile = async (id) => {
    setLoading(true);
    try {
      const profile = await fetchProfile(id);
      setOwner(profile);
      await fetchOwnerHouses(id);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerHouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserHousesById(id);
      setOwnerHouses(response);
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserProfile(id);
    }
  }, [id]);

  if (!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium animate-pulse">
            Preparing your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${backgroundImages[1]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 dark:from-gray-900/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:shadow-3xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={owner.profile_image || profileImage}
                  alt={owner.full_name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white/50 dark:border-gray-700/50 shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                {user?.id === id && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Edit className="text-white h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {owner.full_name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium">
                    {owner.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    owner.is_verified 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {owner.is_verified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>

              {user?.id === id && (
                <button
                  onClick={() => router.push(`/profile/edit/${id}`)}
                  className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Mail className="h-6 w-6 text-blue-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">{owner.email}</span>
              </div>
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Phone className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">
                  {owner.contact_number || owner.phone_number || "Not Provided"}
                </span>
              </div>
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Home className="h-6 w-6 text-purple-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">
                  {owner.location || "Location Not Set"}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <button
                className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-300 ${
                  activeTab === "houses"
                    ? "text-blue-600 border-b-4 border-blue-500 bg-blue-50/50 dark:bg-gray-800"
                    : "text-gray-500 hover:text-blue-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("houses")}
              >
                Properties
              </button>
              {user?.id === owner.id && (
                <>
                  <button
                    className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-300 ${
                      activeTab === "bookings"
                        ? "text-purple-600 border-b-4 border-purple-500 bg-purple-50/50 dark:bg-gray-800"
                        : "text-gray-500 hover:text-purple-500 dark:text-gray-400"
                    }`}
                    onClick={() => setActiveTab("bookings")}
                  >
                    Bookings
                  </button>
                  <button
                    className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-300 ${
                      activeTab === "payments"
                        ? "text-green-600 border-b-4 border-green-500 bg-green-50/50 dark:bg-gray-800"
                        : "text-gray-500 hover:text-green-500 dark:text-gray-400"
                    }`}
                    onClick={() => setActiveTab("payments")}
                  >
                    Payments
                  </button>
                </>
              )}
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === "houses" && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Managed Properties
                  </h3>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader className="animate-spin h-12 w-12 text-blue-500" />
                      <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                        Loading properties...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50/50 dark:bg-red-900/20 p-6 rounded-xl border-l-4 border-red-500 animate-shake">
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  ) : ownerHouses?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ownerHouses?.map((house) => (
                        <HouseCard
                          key={house.id}
                          {...house}
                          className="transform hover:-translate-y-2 transition-all duration-300"
                          onDelete={() => handleDelete(house.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <Home className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="text-gray-600 dark:text-gray-400">
                        {profileQuotes[Math.floor(Math.random() * profileQuotes.length)]}
                      </p>
                      {user?.id === id && (
                        <button
                          onClick={() => router.push('/houses/new')}
                          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300"
                        >
                          List Your First Property
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Other Tabs */}
              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Booking History
                  </h3>
                  {/* Add booking content */}
                </div>
              )}

              {activeTab === "payments" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Payment Records
                  </h3>
                  {/* Add payment content */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  
  );
}