'use client'
import Image from 'next/image'

const partners = [
  {
    name: 'Global Real Estate Council',
    logo: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    name: 'Luxury Living Awards',
    logo: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    name: 'Urban Architecture Group',
    logo: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    name: 'Sustainable Homes Network',
    logo: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  },
  {
    name: 'International Property Awards',
    logo: 'https://images.unsplash.com/photo-1592595896616-c371b9a51247?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }
]

export default function PartnersSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trusted By Industry Leaders
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Partnering with excellence across the real estate ecosystem
          </p>
        </div>
      </div>

      <div className="relative h-48">
        {/* Double the partners array for seamless loop */}
        <div className="absolute inset-0 flex space-x-8 animate-infinite-scroll hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((partner, index) => (
            <div 
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-48 h-48 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={256}
                height={256}
                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}