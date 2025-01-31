'use client'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Star, Quote } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import TrusteesSection from '@/components/TrusteesComponent'
import PartnersSection from '@/components/Partners'

const heroImages = [
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80'
]

const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Luxury Home Buyer',
    comment: 'The personalized service and attention to detail made finding our dream home effortless.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Real Estate Investor',
    comment: 'An indispensable tool for serious investors. The market insights alone are worth it.',
    image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    rating: 5,
  },  {
    id: '4',
    name: 'David Martinez',
    role: 'Real Estate Attorney',
    comment: 'The platform\'s secure transaction system has become our firm\'s preferred choice for client property transfers.',
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    rating: 5
  },
  {
    id: '5',
    name: 'Aisha Patel',
    role: 'Relocation Specialist',
    comment: 'The neighborhood insights feature has been invaluable for helping corporate clients find ideal locations.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da60319?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    rating: 5
  },
  {
    id: '6',
    name: 'James O\'Connor',
    role: 'Property Developer',
    comment: 'Angel House Listing has streamlined our sales process, connecting us with serious buyers efficiently.',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    rating: 4
  },
  {
    id: '7',
    name: 'Sophie Dubois',
    role: 'Interior Designer',
    comment: 'The high-quality property visuals showcase our work beautifully, attracting premium clients.',
    image: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    rating: 5
  }
]

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Layout title="Premium Properties | Angel House Listing">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
              Welcome to Luxury Real Estate
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 animate-fade-in-down delay-100">
              Angel House Listing connects discerning clients with exceptional properties worldwide, 
              combining cutting-edge technology with white-glove service for seamless transactions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {heroImages.map((img, index) => (
              <div 
                key={index}
                className="relative h-48 md:h-64 rounded-xl overflow-hidden group"
              >
                <Image
                  src={img}
                  alt="Luxury property"
                  fill
                  className="object-cover transform transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Client Success Stories</h2>
          <div className="space-y-24">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`flex flex-col md:flex-row items-center gap-8 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-full md:w-1/3 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="relative h-64 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-xl">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className={`w-full md:w-2/3 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <div className="flex mb-4 space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Quote className="absolute top-8 right-8 h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                      "{testimonial.comment}"
                    </p>
                    <div className="border-t pt-4 border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-bold">{testimonial.name}</h3>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PartnersSection/>
        
        <TrusteesSection/>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto rounded-2xl p-8 bg-white/10 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Experience real estate reimagined - where luxury meets innovation
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link 
                href="/houses" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Explore Properties</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent border-2 border-white px-8 py-4 rounded-xl hover:bg-white/20 hover:shadow-lg transition-all duration-300"
              >
                Speak to an Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}