'use client'

import Layout from '../../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  Lock, 
  ShieldAlert, 
  DatabaseIcon, 
  MailCheck, 
  ScrollText, 
  Globe, 
  Shield, 
  AlertCircle, 
  BookmarkCheckIcon
} from 'lucide-react';


const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const unsplashUrls = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1887&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80'
];

const quotes = [
  "Privacy is not an option, it's a fundamental right.",
  "Your data security is our top priority.",
  "Transparency builds trust in the digital age.",
  "Protecting your information is our commitment."
];

const HeroSection = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const updateContent = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setImageUrl(unsplashUrls[randomIndex % unsplashUrls.length]); // Ensures valid indexing
    };

    // Initial content update
    updateContent();

    // Set interval to update content every 3 seconds
    const interval = setInterval(updateContent, 3000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative h-96 w-full overflow-hidden"
  >
    <motion.div
      key={imageUrl} // Ensure this div remounts when imageUrl changes
      className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 dark:from-black/80 dark:to-black/40"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
    <div className="relative h-full flex items-center justify-center text-center px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">
          Privacy & Policy
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 font-light italic">
          "{quote}"
        </p>
      </motion.div>
    </div>
  </motion.div>
  );
};

const PolicySection = ({ icon: Icon, title, children, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const direction = index % 2 === 0 ? -50 : 50;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`p-6 rounded-2xl backdrop-blur-lg ${
        index % 2 === 0 
          ? 'bg-blue-50/30 dark:bg-blue-900/20' 
          : 'bg-purple-50/30 dark:bg-purple-900/20'
      } shadow-lg`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          index % 2 === 0 
            ? 'bg-blue-100 dark:bg-blue-800' 
            : 'bg-purple-100 dark:bg-purple-800'
        }`}>
          <Icon className={`w-6 h-6 ${
            index % 2 === 0 
              ? 'text-blue-600 dark:text-blue-300' 
              : 'text-purple-600 dark:text-purple-300'
          }`} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {title}
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy | House Listing Platform">
      <div className="dark:bg-gray-900 min-h-screen">
        <HeroSection />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 py-12 space-y-12"
        >
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="space-y-12"
          >
            <PolicySection 
              icon={Lock} 
              title="Information We Collect" 
              index={0}
            >
              <p>We collect information that you provide directly to us, such as:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Personal information (e.g., name, email address, phone number)</li>
                <li>Account information (e.g., username, password)</li>
                <li>Property listing details</li>
                <li>Booking information</li>
                <li>Payment information</li>
                <li>Communications with us or other users on the platform</li>
              </ul>
            </PolicySection>

            <PolicySection 
              icon={DatabaseIcon} 
              title="How We Use Your Information" 
              index={1}
            >
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and improving our services</li>
                <li>Processing transactions and bookings</li>
                <li>Communicating with you about our services</li>
                <li>Personalizing your experience</li>
                <li>Analyzing usage of our platform</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </PolicySection>

            <PolicySection 
  icon={ShieldAlert}
  title="Sharing of Information"
  index={2}
>
  <p>We may share your information with:</p>
  <ul className="list-disc pl-6 mt-2 space-y-2">
    <li>Other users as necessary for bookings and communications</li>
    <li>Service providers who assist in our operations</li>
    <li>Legal and regulatory authorities when required by law</li>
    <li>Business partners for joint promotions or services</li>
  </ul>
  <p className="mt-3 font-medium text-blue-600 dark:text-blue-300">
    We do not sell your personal information to third parties.
  </p>
</PolicySection>

<PolicySection 
  icon={Shield}
  title="Data Security"
  index={3}
>
  <p>
    We implement enterprise-grade security measures including:
  </p>
  <ul className="list-disc pl-6 mt-2 space-y-2">
    <li>256-bit SSL encryption</li>
    <li>Regular security audits</li>
    <li>Two-factor authentication</li>
    <li>Anomaly detection systems</li>
  </ul>
  <p className="mt-3 text-sm italic text-gray-600 dark:text-gray-400">
    While we implement rigorous security measures, no system can guarantee 100% protection.
  </p>
</PolicySection>

<PolicySection 
  icon={ScrollText}
  title="Your Rights and Choices"
  index={4}
>
  <div className="space-y-3">
    <p>You have full control over your data:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Access/update through your account dashboard</li>
      <li>Request deletion via our data portal</li>
      <li>Opt-out of communications with one click</li>
      <li>Export your data in standard formats</li>
    </ul>
    <div className="p-3 mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
      <p className="text-sm text-amber-700 dark:text-amber-300">
        Requests are typically processed within 72 hours
      </p>
    </div>
  </div>
</PolicySection>

<PolicySection 
  icon={BookmarkCheckIcon}
  title="Children's Privacy"
  index={5}
>
  <div className="space-y-3">
    <p className="font-medium text-red-600 dark:text-red-400">
      Strictly 18+ Platform
    </p>
    <p>We employ multiple safeguards:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Age verification during signup</li>
      <li>Machine learning pattern detection</li>
      <li>Manual review of suspicious accounts</li>
    </ul>
    <p className="mt-2 text-sm">
      Parents/guardians can contact us immediately for any concerns.
    </p>
  </div>
</PolicySection>

<PolicySection 
  icon={Globe}
  title="International Data Transfers"
  index={6}
>
  <div className="space-y-3">
    <p>Our global infrastructure ensures:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>GDPR-compliant transfers</li>
      <li>EU-US Privacy Shield frameworks</li>
      <li>Data residency options</li>
    </ul>
    <div className="p-3 mt-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <p className="text-sm text-green-700 dark:text-green-300">
        All transfers undergo rigorous legal review
      </p>
    </div>
  </div>
</PolicySection>

<PolicySection 
  icon={AlertCircle}
  title="Policy Changes"
  index={7}
>
  <div className="space-y-3">
    <p>We maintain transparency through:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>30-day notice for major changes</li>
      <li>Version control history</li>
      <li>Change summaries</li>
      <li>User notification system</li>
    </ul>
    <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">
      Continued use after changes constitutes acceptance
    </p>
  </div>
</PolicySection>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-emerald-50/30 dark:bg-emerald-900/20 rounded-2xl backdrop-blur-lg shadow-lg"
            >
              <div className="flex items-center gap-4">
                <MailCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-300" />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Contact Us
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Have questions? Reach us at{' '}
                    <a 
                      href="mailto:privacy@houselistingplatform.com" 
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      privacy@houselistingplatform.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8"
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
}