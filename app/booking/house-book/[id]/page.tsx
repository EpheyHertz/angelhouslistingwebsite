import Layout from '../../../../components/Layout';
import BookingForm from '../../../../components/BookingForm';
import { BookingList } from '../../../../components/BookingList';
import Image from 'next/image';
import Link from 'next/link';

export default async function BookingsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return (
      <Layout title="Bookings | House Listing Platform">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                No House Selected
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please select a property from our curated collection to begin your booking experience.
              </p>
              <Image
                src="https://source.unsplash.com/random/800x600/?house"
                alt="Select a house"
                width={600}
                height={400}
                className="rounded-xl mb-6 mx-auto"
              />
              <Link
                href="/houses"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg
                         hover:bg-blue-700 transition-colors duration-200"
              >
                Browse Available Properties
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Bookings | House Listing Platform">
      <div className="min-h-screen bg-cover bg-center" 
           style={{ backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?vacation)' }}>
        <div className="backdrop-blur-sm bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form Section */}
              <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Secure Your Stay
                </h1>
                <div className="space-y-8">
                  <BookingForm house_id={id} />
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Your Booking History
                    </h2>
                    <BookingList />
                  </div>
                </div>
              </div>

              {/* Right Column - Inspiration Section */}
              <div className="hidden lg:block space-y-8">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Why Book With Us?
                  </h3>
                  <div className="space-y-6">
                    <div className="relative group">
                      <Image
                        src="https://source.unsplash.com/random/600x400/?luxury,interior"
                        alt="Luxury interior"
                        width={600}
                        height={400}
                        className="rounded-xl transform transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 rounded-xl" />
                      <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                        &quot;Exceptional properties curated for unforgettable experiences&quot;
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <span className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            ✨
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          &quot;Our team personally verifies every property to ensure quality and comfort&quot;
                        </p>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <span className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            🔒
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          &quot;Secure booking process with 24/7 customer support&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Travel Inspiration
                  </h3>
                  <Image
                    src="https://source.unsplash.com/random/600x400/?vacation,beach"
                    alt="Travel inspiration"
                    width={600}
                    height={400}
                    className="rounded-xl mb-4"
                  />
                  <blockquote className="text-gray-600 dark:text-gray-300 italic">
                    &quot;Travel is the only thing you buy that makes you richer&quot;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}