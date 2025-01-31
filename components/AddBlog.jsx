'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import MDEditor from '@uiw/react-md-editor'
import { 
  Home, 
  Camera, 
  PenTool, 
  Type, 
  User, 
  BookOpen, 
  Tag, 
  ArrowLeft,
  Loader
} from 'lucide-react'

const CreateBlogPage = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const [featuredImage, setFeaturedImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    excerpt: '',
    tags: ''
  })

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFeaturedImage(file)
      setPreview(URL.createObjectURL(file))
      setErrors(prev => ({ ...prev, featuredImage: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!featuredImage) newErrors.featuredImage = 'Featured image is required'
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        author: '',
        category: '',
        excerpt: '',
        tags: ''
      })
      setFeaturedImage(null)
      setPreview('')
      router.push('/blog')
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Section */}
      <div className="relative h-64">
        <Image
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Writing workspace"
          fill
          className="object-cover opacity-40 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-gray-900/70" />
      </div>

      {/* Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl mx-auto -mt-48 px-4 pb-16"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <PenTool className="inline-block mr-3 w-8 h-8 text-blue-500" />
              Compose New Article
            </h1>
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Featured Image */}
            <div>
              <div className={`group relative h-64 rounded-xl border-2 border-dashed 
                ${errors.featuredImage ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                hover:border-blue-500 transition-colors overflow-hidden`}>
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mb-4 transition-colors" />
                      <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                        Upload Featured Image
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
              {errors.featuredImage && (
                <p className="text-red-500 text-sm mt-2">{errors.featuredImage}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Type className="w-5 h-5 mr-2 text-blue-500" />
                Article Title
              </label>
              <input
                type="text"
                className={`w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 ${
                  errors.title ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                } focus:border-transparent`}
                placeholder="Enter article title..."
                value={formData.title}
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value})
                  setErrors(prev => ({ ...prev, title: '' }))
                }}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            {/* Author & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Author Name
                </label>
                <input
                  type="text"
                  className={`w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 ${
                    errors.author ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                  } focus:border-transparent`}
                  placeholder="Author's name"
                  value={formData.author}
                  onChange={(e) => {
                    setFormData({...formData, author: e.target.value})
                    setErrors(prev => ({ ...prev, author: '' }))
                  }}
                />
                {errors.author && (
                  <p className="text-red-500 text-sm mt-2">{errors.author}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-500" />
                  Category
                </label>
                <select
                  className={`w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 ${
                    errors.category ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                  } focus:border-transparent`}
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({...formData, category: e.target.value})
                    setErrors(prev => ({ ...prev, category: '' }))
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Design">Design</option>
                  <option value="Technology">Technology</option>
                  <option value="Sustainability">Sustainability</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Excerpt & Tags */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Excerpt
                </label>
                <textarea
                  className={`w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 ${
                    errors.excerpt ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                  } focus:border-transparent h-32`}
                  placeholder="Short article summary..."
                  value={formData.excerpt}
                  onChange={(e) => {
                    setFormData({...formData, excerpt: e.target.value})
                    setErrors(prev => ({ ...prev, excerpt: '' }))
                  }}
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-2">{errors.excerpt}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-500" />
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="urban, design, future"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-blue-500" />
                Article Content
              </label>
              <div data-color-mode={theme}>
              <MDEditor
                    value={formData.content}
                    onChange={(value) => {
                    setFormData({...formData, content: value || ''})
                    setErrors(prev => ({ ...prev, content: '' }))
                    }}
                    className={`rounded-lg ${
                    errors.content ? 'ring-2 ring-red-500' : ''
                    }`}
                    height={400}
                    previewOptions={{
                    components: {
                        a: ({ href, children }) => (
                        <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            {children}
                        </a>
                        )
                    },
                    wrapperClassName: 'dark:bg-gray-700 bg-gray-100'
                    }}
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">{errors.content}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin" />
                  Publishing...
                </div>
              ) : (
                'Publish Article'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateBlogPage