'use client'

import Layout from './../../components/Layout'
import Image from 'next/image'
import { Shield, Users, Home, Star } from 'lucide-react'
import { motion } from 'framer-motion'


const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    bio: 'Real estate visionary with 15+ years industry experience'
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bio: 'Tech innovator specializing in property platforms'
  },
  {
    name: 'Emma Williams',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    bio: 'Operations expert ensuring seamless user experiences'
  }
]

const stats = [
  { value: '250k+', label: 'Happy Customers' },
  { value: '1M+', label: 'Listings Posted' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '15+', label: 'Years Experience' }
]

export default function AboutUs() {
  return (
    <Layout title="About Us | House Listing Platform">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Luxury Homes"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl font-bold text-white mb-6">Redefining Real Estate Excellence</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Pioneering transparent property solutions through innovation and integrity
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Modern Home"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              At House Listing Platform, we're transforming property transactions through cutting-edge technology 
              and unparalleled service. Our mission is to create a seamless bridge between dream homes and 
              prospective owners, backed by rigorous verification and market expertise.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              We combine big data analytics with human insight to deliver personalized real estate solutions, 
              ensuring every client journey concludes with keys in hand and smiles all around.
            </p>
          </div>
        </motion.section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Core Principles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Integrity",
                content: "Every listing undergoes 25-point verification for absolute authenticity",
                color: "blue"
              },
              {
                icon: Users,
                title: "Client-Centric",
                content: "24/7 personalized support from our expert advisory team",
                color: "green"
              },
              {
                icon: Home,
                title: "Market Leadership",
                content: "Pioneering AI-driven valuations and predictive analytics",
                color: "purple"
              },
              {
                icon: Star,
                title: "Premium Service",
                content: "White-glove treatment from initial search to final settlement",
                color: "yellow"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-${value.color}--500 to-${value.color}-300`} />
                <value.icon className={`w-12 h-12 mb-6 text-${value.color}-500`} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.content}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className="group relative text-center"
              >
                <div className="relative h-96 rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm">{member.bio}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Commitment Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-blue-600 dark:bg-blue-800 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Our Promise</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto leading-relaxed">
            We commit to maintaining the highest ethical standards while leveraging advanced technology 
            to simplify real estate transactions. Our platform evolves daily through user feedback and 
            market insights, ensuring we remain at the industry&apos;s cutting edge.
          </p>
          <div className="mt-8 flex justify-center space-x-6">
            <Image
              src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Modern Architecture"
              width={400}
              height={250}
              className="rounded-xl shadow-xl"
            />
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Luxury Interior"
              width={400}
              height={250}
              className="rounded-xl shadow-xl hidden lg:block"
            />
          </div>
        </motion.section>
      </div>
    </Layout>
  )
}