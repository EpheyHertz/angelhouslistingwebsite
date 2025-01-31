'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDown,
  BookOpen,
  Clock,
  Tag,
  User,
  Share2,
  MessageCircle,
  Loader
} from 'lucide-react'
import Layout from '../../components/Layout'

export default function BlogPage(){
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState('')

  // Mock data
  const categories = ['Architecture', 'Design', 'Technology', 'Sustainability']
  const tags = ['Urban', 'Innovation', 'Future', 'Eco-friendly']
  const blogPosts = [...Array(6)].map((_, i) => ({
    id: i + 1,
    title: `The Future of Urban Living ${i + 1}`,
    content: '...', // Add actual content
    excerpt: "Exploring innovative approaches to modern city architecture...",
    category: categories[i % 4],
    readTime: `${Math.floor(Math.random() * 10) + 5} min read`,
    author: { name: "Sarah Thompson", bio: "Urban design expert..." },
    date: "Mar 15, 2024",
    // image: `https://source.unsplash.com/random/800x600?sig=${i}`
    image: `https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`
  }))

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || post.category === selectedCategory)
  )

  const handleLoadMore = () => setPage(prev => prev + 1)
  const handleCommentSubmit = (postId) => {
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { text: newComment, date: new Date() }]
    }))
    setNewComment('')
  }

  return (
    <Layout title={`Posted Blogs`}>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-white dark:bg-gray-800 p-6 shadow-sm z-30"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.slice(0, page * 4).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-60">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-full" />
                  ) : (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm">
                      {post.category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                      <Clock size={14} /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {post.author.name}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-gray-500 hover:text-blue-500 transition-colors">
                        <Share2 size={18} />
                      </button>
                      <Link href={`/blog/${post.id}`} className="text-blue-500 hover:text-blue-600">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t dark:border-gray-700 p-6">
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button 
                      onClick={() => handleCommentSubmit(post.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Post
                    </button>
                  </div>
                  {(comments[post.id] || []).map((comment, i) => (
                    <div key={i} className="text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded mb-2">
                      {comment.text}
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length > page * 4 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  'Load More Articles'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block w-80"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-bold mt-8 mb-4 text-gray-900 dark:text-white">
              Author Spotlight
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {blogPosts[0].author.name[0]}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {blogPosts[0].author.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {blogPosts[0].author.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
    </Layout>
  )
}

