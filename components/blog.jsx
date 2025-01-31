'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Clock,
  User,
  Share2,
  MessageCircle,
  ArrowLeft,
  BookOpen,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react'
import { useState } from 'react'

const calculateReadTime = (content) => {
  const text = content.replace(/<[^>]+>/g, ' ').trim()
  if (!text) return '0 min read'
  const wordCount = text.split(/\s+/).length
  const minutes = Math.ceil(wordCount / 200)
  return `${minutes} min read`
}

const BlogPost = () => {
  const { theme } = useTheme()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isSharing, setIsSharing] = useState(false)

  // Post content with calculated reading time
  const content = `
    <p class="mb-4">In the heart of modern cities, a new architectural revolution is taking shape. Architects and urban planners are collaborating to create sustainable living spaces that harmonize with nature while maintaining modern comforts.</p>
    
    <h2 class="text-2xl font-bold my-6">Redefining City Spaces</h2>
    
    <p class="mb-4">Urban planners are integrating green spaces with residential complexes, creating vertical gardens and energy-efficient buildings that reduce carbon footprints. These innovations are transforming concrete jungles into livable, eco-friendly environments.</p>
    
    <img src="https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80" 
         alt="Green building" 
         class="rounded-xl my-8" />
    
    <p class="mb-4">The integration of smart home technology with sustainable materials is creating buildings that adapt to their inhabitants' needs while maintaining energy efficiency. From solar-paneled roofs to greywater recycling systems, modern homes are becoming self-sufficient ecosystems.</p>
  `

  const post = {
    id: 1,
    title: "The Future of Sustainable Urban Living",
    content,
    category: "Architecture",
    readTime: calculateReadTime(content),
    author: {
      name: "Emily Carter",
      bio: "Lead Urban Designer at FutureSpace Architects",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80",
    relatedPosts: [
      { id: 2, title: "Smart Home Innovations", category: "Technology" },
      { id: 3, title: "Eco-Friendly Materials", category: "Sustainability" }
    ]
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      setComments([...comments, { 
        text: comment, 
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        author: 'Anonymous User'
      }])
      setComment('')
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const text = `${post.title} - ${post.author.name}`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    }

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-96 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${
            theme === 'dark' 
              ? 'from-gray-900/90 via-gray-900/50 to-transparent' 
              : 'from-white/90 via-white/50 to-transparent'
          }`} />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl"
          >
            <Link 
              href="/blog" 
              className="flex items-center text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> 
              Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 items-center text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 prose dark:prose-invert max-w-3xl"
        >
          <div
            className="text-lg text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Comments Section */}
          <section className="mt-16 not-prose">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
              Discussion ({comments.length})
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Post Comment
                </motion.button>
              </div>
            </form>

            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        {comment.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{comment.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        </motion.article>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 space-y-8"
        >
          {/* Author Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-700">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {post.author.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.author.bio}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
            >
              Follow Author
            </motion.button>
          </div>

          {/* Social Sharing */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Share this article
            </h3>
            <div className="flex gap-3">
              {[
                { platform: 'twitter', Icon: Twitter },
                { platform: 'facebook', Icon: Facebook },
                { platform: 'linkedin', Icon: Linkedin }
              ].map(({ platform, Icon }) => (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare(platform)}
                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  aria-label={`Share on ${platform}`}
                >
                  <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Related Articles
            </h3>
            <div className="space-y-4">
              {post.relatedPosts.map((relatedPost) => (
                <motion.article
                  key={relatedPost.id}
                  whileHover={{ x: 5 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <span className="text-sm text-blue-500 font-medium">
                    {relatedPost.category}
                  </span>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {relatedPost.title}
                  </h4>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}

export default BlogPost