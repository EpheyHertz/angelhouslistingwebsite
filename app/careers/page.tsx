'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Briefcase, Upload } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const jobOpenings = [
  {
    id: 1,
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'We are seeking a skilled Full Stack Developer to join our growing team. The ideal candidate will have experience with React, Node.js, and database technologies.',
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'We &apos;re looking for a talented UX/UI Designer to help create intuitive and visually appealing interfaces for our platform. Experience with Figma and user research is a plus.',
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Join our marketing team to help grow our user base and increase brand awareness. The ideal candidate will have experience in digital marketing and content creation.',
  },
]

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Application submitted:', { name, email, resume, coverLetter, jobId: selectedJob })
    setName('')
    setEmail('')
    setResume(null)
    setCoverLetter(null)
    setSelectedJob(null)
    setIsLoading(false)
  }

  return (
    <Layout title="Careers | House Listing Platform">
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Career Hero"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl font-bold text-white mb-6">Build the Future of Real Estate</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our passionate team revolutionizing how people find their dream homes
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Current Openings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobOpenings.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={job.image}
                    alt={job.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-sm text-blue-500 dark:text-blue-400 mb-4">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span>{job.department}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  <button
                    onClick={() => setSelectedJob(job.id)}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <AnimatePresence>
          {selectedJob && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Apply for {jobOpenings.find(job => job.id === selectedJob)?.title}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <FileUpload 
                    label="Resume"
                    file={resume}
                    onChange={setResume}
                    required
                  />

                  <FileUpload 
                    label="Cover Letter"
                    file={coverLetter}
                    onChange={setCoverLetter}
                    required
                  />

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : 'Submit Application'}
                    </button>
                  </div>
                </div>
              </motion.form>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

function FileUpload({ label, file, onChange, required }: { 
  label: string
  file: File | null
  onChange: (file: File | null) => void
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg border-2 border-dashed border-blue-400 dark:border-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-300">
          <Upload className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">
            {file ? file.name : `Click to upload ${label}`}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            required={required}
          />
        </label>
      </div>
    </div>
  )
}