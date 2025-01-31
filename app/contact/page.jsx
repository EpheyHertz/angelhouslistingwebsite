
'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast';
import { submitContactForm } from '@/app/server-action/contact-action'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const formPayload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value)
      })

      const response=await submitContactForm(formPayload);
      if (response.success){toast.success('Message Sent Successfully!', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
       
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setSubmitting(false)
    }else{

      toast.error(response.message||'Failed to send message. Please try again.', {
        
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setSubmitting(false)
    }
   
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Layout title="Contact Us | House Listing Platform">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center animate-fade-in-up">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-40"
                    required
                  ></textarea>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                  submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info with Image Gallery (remains unchanged) */}
          <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Luxury Home"
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/60" />
            </div>
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-center text-white">
              <h2 className="text-3xl font-semibold mb-8">Our Location</h2>
              <div className="space-y-6">
                <div className="flex items-start bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <Mail className="w-8 h-8 text-blue-400 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Email</h3>
                    <p className="text-gray-200">info@houselistingplatform.com</p>
                  </div>
                </div>
                <div className="flex items-start bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <Phone className="w-8 h-8 text-green-400 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Phone</h3>
                    <p className="text-gray-200">+254 7000000</p>
                  </div>
                </div>
                <div className="flex items-start bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <MapPin className="w-8 h-8 text-red-400 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Address</h3>
                    <p className="text-gray-200">
                      123 Main Street<br />
                      Embu County<br />
                      Kemya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}