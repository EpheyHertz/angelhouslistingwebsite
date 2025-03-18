import React from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  Linkedin,
  MessageCircle,
  Facebook,
  Home,
  CreditCard,
  Shield,
} from 'lucide-react';

const LinkDetails = ({ house }) => {
  if (!house) {
    return <div className="text-center text-gray-600 dark:text-gray-300">No house data available.</div>;
  }

  // Format dates
  const createdAt = house.created_at;
  const updatedAt = house.updated_at;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900">
      {/* House Status and Sale Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full">
            {house.status}
          </span>
          {house.on_sale && (
            <span className="px-3 py-1 text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full">
              On Sale
            </span>
          )}
        </div>
        <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Listed on: {createdAt}</span>
        </div>
      </div>

      {/* Price and Currency */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {house.currency || 'Kes'} {house.price.toLocaleString()}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Price</p>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="text-gray-600 dark:text-gray-300">{house.email || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="text-gray-600 dark:text-gray-300">{house.phone_number || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="text-gray-600 dark:text-gray-300">{house.country || "Not Provided!"}</span>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Social Media</h3>
        <div className="flex items-center gap-4">
          {house.linkedin ? (
            <a
              href={house.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Linkedin className="h-5 w-5" />
              <span>LinkedIn</span>
            </a>
          ):<div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            <Linkedin className="h-5 w-5" />
            <span className="text-gray-600 dark:text-gray-300">No LinkedIn</span>
            
            
          </div> }
          {house.whatsapp ? (
            <a
              href={`https://wa.me/${house.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
          ):<div className="flex items-center gap-2 text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
            <MessageCircle className="h-5 w-5" />
            <span className="text-gray-600 dark:text-gray-300">No WhatsApp</span>
            </div>}
          {house.facebook ? (
            <a
              href={house.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </a>
          ):<div className="flex items-center gap-2 text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
          <Facebook className="h-5 w-5" />
          <span className="text-gray-600 dark:text-gray-300">No Facebook</span>
          </div>
          }
        </div>
      </div>

      {/* Additional Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Details</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="text-gray-600 dark:text-gray-300">Created: {createdAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span className="text-gray-600 dark:text-gray-300">Last Updated: {updatedAt}</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8">
        <button className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
          Contact Seller
        </button>
      </div>
    </div>
  );
};

export default LinkDetails;