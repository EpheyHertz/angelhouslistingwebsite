'use client'

import { useState, useEffect } from 'react'
import { Share2, Copy, Check, Download, Facebook, Twitter, Linkedin, Mail } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'

interface ShareHouseProps {
  houseId: string | number
  title?: string
  image?: string
  className?: string
  variant?: 'icon' | 'button' | 'floating'
  onClose?: () => void
}

const ShareHouse = ({ 
  houseId, 
  title = 'Check out this amazing property!', 
  image = '', 
  className = '',
  variant = 'button',
  onClose
}: ShareHouseProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [domain, setDomain] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [useCustomImage, setUseCustomImage] = useState(false)

  // Detect domain and generate share URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentDomain = window.location.origin
      setDomain(currentDomain)
      setShareUrl(`${currentDomain}/houses/${houseId}`)
    }
    
    // Check if image is from same origin or should be used
    if (image) {
      // For safety, only use images from same origin
      const isSameOrigin = image.startsWith('/') || 
                           (typeof window !== 'undefined' && image.startsWith(window.location.origin))
      setUseCustomImage(isSameOrigin)
    }
  }, [houseId, image])

  // Handle closing the modal
  const handleClose = () => {
    setIsOpen(false)
    if (onClose) {
      onClose()
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleDownloadQR = () => {
    try {
      const canvas = document.getElementById('house-qr-code') as HTMLCanvasElement
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png')
        
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = `property-${houseId}-qr.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        toast.success('QR Code downloaded!')
      }
    } catch (error) {
      console.error('QR download error:', error)
      toast.error('Failed to download QR code')
    }
  }

  const shareToSocial = (platform: string) => {
    let shareLink = ''
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'email':
        shareLink = `mailto:?subject=${encodedTitle}&body=Check out this property: ${shareUrl}`
        break
      default:
        return
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer')
  }

  // Render different button variants
  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-all duration-300"
            aria-label="Share this property"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )
      case 'floating':
        return (
          <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 z-20"
            aria-label="Share this property"
          >
            <Share2 className="w-6 h-6" />
          </button>
        )
      default:
        return (
          <button 
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${className}`}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        )
    }
  }

  return (
    <>
      {/* Only render button if not being used in modal mode */}
      {!onClose && renderButton()}

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Share this property</h3>
            
            {/* QR Code - removed potentially problematic image settings */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeCanvas 
                  id="house-qr-code"
                  value={shareUrl} 
                  size={180}
                  level="H"
                  // Only include imageSettings if we have a safe image
                  {...(useCustomImage ? {
                    imageSettings: {
                      src: image,
                      x: undefined,
                      y: undefined,
                      height: 36,
                      width: 36,
                      excavate: true,
                    }
                  } : {})}
                />
              </div>
            </div>
            
            {/* Copy Link */}
            <div className="flex mb-6">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                onClick={handleCopyLink}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition-colors duration-300"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Download QR */}
            <button 
              onClick={handleDownloadQR}
              className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-300"
            >
              <Download className="w-5 h-5" />
              <span>Download QR Code</span>
            </button>
            
            {/* Social Share */}
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => shareToSocial('facebook')}
                className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={() => shareToSocial('twitter')}
                className="p-3 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-300 flex items-center justify-center"
                aria-label="Share on Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => shareToSocial('linkedin')}
                className="p-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button 
                onClick={() => shareToSocial('email')}
                className="p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
                aria-label="Share via Email"
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ShareHouse