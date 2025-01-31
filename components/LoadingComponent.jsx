"use client"
import { motion, useMotionValue, animate } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

const LoadingScreen = () => {
    const [images, setImages] = useState([])
    // Fixed initialization
  const progress = useMotionValue(0)
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
  }

  useEffect(() => {
    // Random real estate-themed Unsplash images
    const unsplashUrls = [
'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1887&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80'
    ]
    setImages(unsplashUrls)

    // Animate progress bar
    const animateProgress = () => {
      animate(progress, 100, {
        duration: 2,
        ease: "easeInOut",
        onComplete: () => progress.set(0),
      })
      const interval = setInterval(animateProgress, 2200)
      return () => clearInterval(interval)
    }
    animateProgress()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 backdrop-blur-lg">
      <div className="relative max-w-4xl w-full px-4">
        {/* Animated Image Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 opacity-50">
          {images.map((img, index) => (
            <motion.div
              key={index}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                delay: index * 0.1,
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={img}
                alt="Loading background"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div className="relative w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
            <motion.div
              style={{ width: progress }}
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </motion.div>

          {/* Animated Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader2 className="h-12 w-12 text-blue-500 dark:text-purple-400" />
          </motion.div>

          {/* Animated Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              y: { duration: 0.8, repeat: Infinity, repeatType: "mirror" },
              opacity: { duration: 1.5, repeat: Infinity },
            }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Loading Your Dream Home
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Curating the perfect real estate experience...
            </p>
          </motion.div>
        </div>

        {/* Floating Decorations */}
        <motion.div
          className="absolute top-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </div>
    </div>
  )
}

export default LoadingScreen
