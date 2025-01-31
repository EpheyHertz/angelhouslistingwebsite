'use client'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  FileText,
  UserCircle,
  Home,
  CheckCircle2,
  Lock,
  Globe,
  BookOpen,
  Scale,
  Ban,
  DollarSign,
  CreditCard,
  Clock,
  Banknote,
  RefreshCw,
  ShieldCheck,
  Fingerprint,
  EyeOff,
  X,
  AlertTriangle,
  Users,
  Building,
  Image,
  Sparkles,
  Code,
  Paintbrush,
  FileCheck,
  UserMinus,
  Flag,
  AlertCircle,
  User,
  ArrowRightCircle,
  Gavel,
  Handshake,
  MapPin,
  FileUp,
  PenSquare,
  Megaphone,
  Bell,
  Calendar,
  BadgeCheck,
  Eye,
  Bookmark,
  MessagesSquare,
  Mail,
  Phone,
  Rocket,
  Landmark,
  CircleDollarSign,
  ScrollText,
  BookmarkCheck,
  ShieldAlert,
  Check,
  BanIcon,
  XIcon,
  Building2Icon,
  ShieldIcon,
  LockIcon,
  FingerprintIcon,
  EyeIcon,
  Scale3DIcon,
  CopyrightIcon,
  GlobeIcon,
  PictureInPicture,
  Globe2
} from "lucide-react";
import Layout from '../../components/Layout'
import { useEffect, useState } from 'react'
// import { ShieldAlert, Sc } from 'lucide-react'

const houseImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1887&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2070&q=80'
]

const trustQuotes = [
  "Transparency Builds Trust - Our Commitment to Clear Agreements",
  "Your Security is Our Priority - Protected by Advanced Encryption",
  "Empowering Responsible Property Management Through Technology"
]

export default function TermsPage() {
  const { scrollYProgress } = useScroll()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % houseImages.length)
    }, 10000)
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % trustQuotes.length)
    }, 8000)
    return () => {
      clearInterval(imageTimer)
      clearInterval(quoteTimer)
    }
  }, [])

  const legalSections = [
    { id: 1, title: "1. Acceptance of Terms", icon: <Handshake className="h-6 w-6" /> },
    { id: 2, title: "2. User Responsibilities", icon: <Scale className="h-6 w-6" /> },
    { id: 3, title: "3. Property Listings", icon: <Home className="h-6 w-6" /> },
    { id: 4, title: "4. Booking & Payment", icon: <Lock className="h-6 w-6" /> },
    { id: 5, title: "5. Security & Privacy", icon: <ShieldAlert className="h-6 w-6" /> },
    { id: 6, title: "6. Prohibited Conduct", icon: <Users className="h-6 w-6" /> },
    { id: 7, title: "7. Limitation of Liability", icon: <FileText className="h-6 w-6" /> }
  ]

  return (
    <Layout title="Terms & Conditions | Angel HouseListing">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        {/* Scroll Progress */}
        <motion.div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${houseImages[currentImageIndex]})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative h-full flex items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
                Terms & Conditions
              </h1>
              <AnimatePresence mode='wait'>
                <motion.p
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl text-gray-200 font-medium"
                >
                  "{trustQuotes[currentQuoteIndex]}"
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Legal Navigation Cards */}
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legalSections.map((section, index) => (
            <motion.a
              key={section.id}
              href={`#section-${section.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-3 text-blue-500">
                {section.icon}
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {section.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {section.id === 1 && "By accessing our platform, you agree to comply with all terms and conditions"}
                {section.id === 2 && "Understand your obligations as a user of our services"}
                {section.id === 3 && "Guidelines for creating and managing property listings"}
                {section.id === 4 && "Secure payment processing and booking policies"}
                {section.id === 5 && "Data protection and privacy commitments"}
                {section.id === 6 && "Prohibited activities and content guidelines"}
                {section.id === 7 && "Understanding platform responsibilities and limitations"}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Detailed Legal Content */}
        
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
  {/* Section 1 - Acceptance */}
          <motion.section 
            id="section-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
          >
            <div className="absolute top-6 right-6">
              <FileText className="w-16 h-16 text-blue-400 dark:text-blue-600 opacity-30" />
            </div>
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
              >
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              Acceptance of Terms
            </h2>
            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <p className="text-lg leading-relaxed">By accessing and using Angel HouseListing, you agree to:</p>
              <motion.ul 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.2 }}
              >
                {['Comply with all laws', 'Accept Terms in full', 'Acknowledge updates'].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    whileHover={{ x: 10 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.section>

          {/* Section 2 - Responsibilities */}
          <motion.section
            id="section-2"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
            viewport={{ once: true, margin: "-100px" }}
            className="p-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
          >
            <div className="absolute top-6 right-6">
              <UserCircle className="w-16 h-16 text-green-400 dark:text-green-600 opacity-30" />
            </div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-8 flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
              >
                <UserCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>
              User Responsibilities
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck , title: "Accurate Info", text: "Provide truthful information" },
                { icon: Lock, title: "Account Security", text: "Protect credentials" },
                { icon: Globe, title: "Local Laws", text: "Comply with regulations" },
                { icon: BookOpen, title: "Intellectual Property", text: "Respect copyrights" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <item.icon className="w-12 h-12 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 3 - Property Listings */}
          <motion.section
            id="section-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
          >
            <div className="absolute top-6 right-6">
              <Home className="w-16 h-16 text-amber-400 dark:text-amber-600 opacity-30" />
            </div>
            <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-8 flex items-center gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
              >
                <Home className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </motion.div>
              Property Listings
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div 
                className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ rotate: -2 }}
              >
                <Scale className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Accuracy Required</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Detailed descriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Current pricing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Availability updates
                  </li>
                </ul>
              </motion.div>

              <motion.div 
                className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ rotate: 2 }}
              >
                <BanIcon className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Prohibited Content</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <XIcon className="w-5 h-5 text-red-500" />
                    Illegal listings
                  </li>
                  <li className="flex items-center gap-2">
                    <XIcon className="w-5 h-5 text-red-500" />
                    Fraudulent offers
                  </li>
                  <li className="flex items-center gap-2">
                    <XIcon className="w-5 h-5 text-red-500" />
                    Harmful activities
                  </li>
                </ul>
              </motion.div>

              <motion.div 
                className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <Building2Icon className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Regulatory Compliance</h3>
                <p className="text-gray-600 dark:text-gray-400">All listings must adhere to local housing regulations and zoning laws.</p>
              </motion.div>
            </div>
          </motion.section>
                          {/* Section 4 - Booking & Payment */}
        <motion.section
          id="section-4"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <DollarSign className="w-16 h-16 text-purple-400 dark:text-purple-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            Booking & Payment
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
            >
              <Clock className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Booking Process</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Direct tenant-host agreements
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Clear terms verification
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <Banknote className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Payments</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  Secure transactions
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Multi-currency support
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ rotate: 2 }}
            >
              <ArrowRightCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Cancellations</h3>
              <p className="text-gray-600 dark:text-gray-400">Review host-specific policies with clear refund timelines and penalty terms.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 5 - Security & Privacy */}
        <motion.section
          id="section-5"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <ShieldIcon className="w-16 h-16 text-blue-400 dark:text-blue-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <LockIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            Security & Privacy
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <FingerprintIcon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Encryption</h3>
              <p className="text-gray-600 dark:text-gray-400">Bank-grade SSL encryption for all transactions and data transfers</p>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <FileText  className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy Policy</h3>
              <p className="text-gray-600 dark:text-gray-400">Strict no-sharing policy with third parties without consent</p>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <EyeIcon className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Account Protection</h3>
              <p className="text-gray-600 dark:text-gray-400">Two-factor authentication and suspicious activity monitoring</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 6 - Prohibited Conduct */}
        <motion.section
          id="section-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <BanIcon className="w-16 h-16 text-red-400 dark:text-red-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <BanIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </motion.div>
            Prohibited Conduct
          </h2>
          <motion.div 
            className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md"
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ul className="space-y-4">
              {[
                "Fraudulent listings",
                "Discriminatory practices", 
                "Illegal activities",
                "Platform manipulation",
                "Identity misrepresentation"
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg"
                  whileHover={{ x: 10 }}
                >
                  <XIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* Section 7 - Limitation of Liability */}
        <motion.section
          id="section-7"
          initial={{ opacity: 0, rotateX: 90 }}
          whileInView={{ opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <AlertTriangle className="w-16 h-16 text-amber-400 dark:text-amber-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <Scale3DIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </motion.div>
            Liability Limitations
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <Users className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">User Disputes</h3>
              <p className="text-gray-600 dark:text-gray-400">Not responsible for disagreements between hosts and tenants</p>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <Building className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Property Issues</h3>
              <p className="text-gray-600 dark:text-gray-400">No liability for damages or maintenance problems</p>
            </motion.div>
          </div>
          <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <p className="italic text-gray-600 dark:text-gray-400">
              Users agree to use the platform at their own risk and discretion
            </p>
          </div>
        </motion.section>

        {/* Section 8 - Intellectual Property */}
        <motion.section
          id="section-8"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring" }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <CopyrightIcon className="w-16 h-16 text-green-400 dark:text-green-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <GlobeIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            Intellectual Property
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <PictureInPicture className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Protected Assets</h3>
              <div className="flex flex-wrap gap-4">
                <motion.div 
                  className="px-4 py-2 bg-emerald-100 dark:bg-gray-800 rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Platform Content
                </motion.div>
                <motion.div 
                  className="px-4 py-2 bg-emerald-100 dark:bg-gray-800 rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Code className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Software
                </motion.div>
                <motion.div 
                  className="px-4 py-2 bg-emerald-100 dark:bg-gray-800 rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Paintbrush className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Brand Elements
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ rotate: -2 }}
            >
              <FileCheck className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Usage Rights</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  No commercial use without permission
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Attribution required for authorized use
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  No derivative works allowed
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 9 - Termination */}
        <motion.section
          id="section-9"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <UserMinus className="w-16 h-16 text-pink-400 dark:text-pink-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <Flag className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </motion.div>
            Service Termination
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <AlertCircle  className="w-12 h-12 text-rose-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">By Company</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <XIcon className="w-5 h-5 text-red-500" />
                  Terms violation
                </li>
                <li className="flex items-center gap-2">
                  <XIcon className="w-5 h-5 text-red-500" />
                  Suspicious activity
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <User className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">By User</h3>
              <div className="flex items-center gap-4">
                <ArrowRightCircle  className="w-8 h-8 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Contact support for account deactivation requests</p>
              </div>
            </motion.div>
          </div>
        </motion.section>
        {/* Section 10 - Dispute Resolution */}
        <motion.section
          id="section-10"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 40 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <Scale className="w-16 h-16 text-indigo-400 dark:text-indigo-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <Gavel className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            Dispute Resolution
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <Handshake className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Arbitration Process</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  30-day negotiation period
                </li>
                <li className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-500" />
                  Binding arbitration
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  [Jurisdiction] laws apply
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ rotate: -2 }}
            >
              <Globe2 className="w-12 h-12 text-violet-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Governing Law</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-gray-800 rounded-lg">
                  <Flag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  Subject to laws of [Your Jurisdiction]
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-gray-800 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  Exclusive venue: [Court Name]
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 11 - Amendments */}
        <motion.section
          id="section-11"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <FileUp  className="w-16 h-16 text-cyan-400 dark:text-cyan-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <PenSquare  className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </motion.div>
            Terms Amendments
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <Megaphone className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Update Policy</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <RefreshCw  className="w-5 h-5 text-cyan-500 animate-spin" />
                  Periodic revisions
                </li>
                <li className="flex items-center gap-2">
                  <Bell  className="w-5 h-5 text-cyan-500" />
                  Platform notifications
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                  Effective date stamps
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ rotate: 3 }}
            >
              <BadgeCheck  className="w-12 h-12 text-sky-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">User Acceptance</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-cyan-50 dark:bg-gray-800 rounded-lg">
                  <EyeIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  Continued use = Agreement
                </div>
                <div className="flex items-center gap-3 p-3 bg-cyan-50 dark:bg-gray-800 rounded-lg">
                  <Bookmark  className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  Archive previous versions
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 12 - Contact */}
        <motion.section
          id="section-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="p-10 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
        >
          <div className="absolute top-6 right-6">
            <MessagesSquare className="w-16 h-16 text-teal-400 dark:text-teal-600 opacity-30" />
          </div>
          <h2 className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-8 flex items-center gap-4">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg"
            >
              <Mail  className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </motion.div>
            Contact Information
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.a 
              href="mailto:support@angelhouselisting.com"
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-full flex justify-center mb-4">
                <div className="p-4 bg-teal-100 dark:bg-gray-800 rounded-2xl group-hover:rotate-12 transition-transform">
                  <Mail  className="w-12 h-12 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">support@angelhouselisting.com</p>
            </motion.a>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="w-full flex justify-center mb-4">
                <div className="p-4 bg-emerald-100 dark:bg-gray-800 rounded-2xl">
                  <Phone  className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">[Insert Phone Number]</p>
            </motion.div>

            <motion.div 
              className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ rotate: 2 }}
            >
              <div className="w-full flex justify-center mb-4">
                <div className="p-4 bg-cyan-100 dark:bg-gray-800 rounded-2xl">
                  <MapPin className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Address</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">[Insert Company Address]</p>
            </motion.div>
          </div>
          <div className="mt-8 text-center">
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              We typically respond within 24 business hours
            </motion.p>
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section
          className="text-center py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Thank You for Choosing Angel HouseListing!
            </h3>
            <motion.div
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <motion.a
              href='/' 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}>
                <Rocket  className="w-6 h-6" />
                Start Listing Today
              </motion.a>
            </motion.div>
          </div>
        </motion.section>

          {/* Contact Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-8 bg-blue-50 dark:bg-gray-700 rounded-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Contact Us</h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>Email: support@angelhouselisting.com</p>
              <p>Phone: [Insert Phone Number]</p>
              <p>Address: [Insert Company Address]</p>
            </div>
          </motion.section>

          {/* Home Button */}
          <motion.div
            className="text-center py-8"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
          >
            <motion.a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
            >
              🏠 Return to Home
            </motion.a>
          </motion.div>
        </div>

        {/* Back to Top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-4 p-4 bg-white dark:bg-gray-800 shadow-xl rounded-full hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.1 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      </div>
    </Layout>
  )
}