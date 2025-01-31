'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import HouseCard from '../../components/HouseCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setLocation, setPriceRange, setBedrooms, resetFilters } from '../../store/filterSlice';
import { api } from '@/app/lib/api/client';
import { Loader } from 'lucide-react';
import { useAuth } from '@/hooks/hooks';

interface House {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  amenities?: string[];
  imageUrl: string;
  image_urls: string[];
  owner_id: number;
  likeCount: number;
  bathrooms: number;
  userId: number;
  owner: {
    id: number
    username: string
    full_name: string
    email: string
    contact_number: string | null
    location: string | null
    profile_image: string | null
    role: 'regular_user' | 'admin'| 'house_owner'
    is_verified: boolean
    verification_status: string
    phone_number: number
    created_at: string
    updated_at: string | null
  }
  onDelete: (id: number) => void;
  reviews: {
    reviewerId: number;
    reviewerName: string;
    rating: number;
    comment: string;
  }[];
  [key: string]: unknown;
}

export default function Houses() {
  const dispatch = useDispatch();
  const { location, minPrice, maxPrice, bedrooms } = useSelector((state: RootState) => state.filter);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [houses, setHouses] = useState<House[]>([]);
  const {user}=useAuth()
  const [loading, setLoading] = useState(true);
  const housesPerPage = 6;

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const response = await api.get('apis/houses/all'); // API call
      // console.log('Full response:', response.data); // Debug the full response

      // Extract houses from the response
      const houses = response.data.houses;
      // console.log('Extracted houses:', houses); // Debug extracted houses

      setHouses(houses); // Save the data to state
    } catch (error) {
      console.error('Failed to fetch houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHouses = houses.filter((house: House) => {
    const locationMatch = !location || house.location.toLowerCase() === location.toLowerCase();
    const bedroomsMatch = !bedrooms || house.bedrooms >= bedrooms;
    const priceMatch = house.price >= (minPrice || 0) && house.price <= (maxPrice || Infinity);

    return (
      house.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      locationMatch &&
      bedroomsMatch &&
      priceMatch
    );
  });

  console.log('Filtered Houses:', filteredHouses);

  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = filteredHouses.slice(indexOfFirstHouse, indexOfLastHouse);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLocation(e.target.value));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    dispatch(setPriceRange({ min, max }));
  };

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setBedrooms(parseInt(e.target.value)));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <Layout title="Houses | House Listing Platform">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                id="location"
                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={location}
                onChange={handleLocationChange}
              >
                <option value="">All Locations</option>
                <option value="Countryside">Countryside</option>
                <option value="Downtown">Downtown</option>
                <option value="Beach Town">Beach Town</option>
                <option value="Alps">Alps</option>
                <option value="Metropolis">Metropolis</option>
                <option value="Suburbs">Suburbs</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Price
              </label>
              <input
                type="number"
                id="min-price"
                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={minPrice}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), maxPrice)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Price
              </label>
              <input
                type="number"
                id="max-price"
                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={maxPrice}
                onChange={(e) => handlePriceRangeChange(minPrice, parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Bedrooms
              </label>
              <select
                id="bedrooms"
                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bedrooms}
                onChange={handleBedroomsChange}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
            >
              Reset Filters
            </button>
          </div>
        </aside>
        <main className="w-full md:w-3/4">
          <div className="mb-6">
            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search for houses..."
                className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition duration-200">
                <Search className="h-6 w-6" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader className="animate-spin h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Loading...</p>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentHouses.map((house: House) => (
                <HouseCard
                  key={house.id}
                  id={house.id}
                  title={house.title}
                  price={house.price}
                  location={house.location}
                  bedrooms={house.bedrooms}
                  bathrooms={house.bathrooms}
                  likeCount={house.likeCount}
                  imageUrl={house.imageUrl}
                  image_urls={house.image_urls}
                  owner_id={house.owner_id}
                  owner={house.owner}
                  reviews={house.reviews}
                  userId={user?.id|| 0 }
                />
              ))}
            </div>
          )}
          {filteredHouses.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-8">No houses found matching your criteria.</p>
          )}
          {filteredHouses.length > housesPerPage && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: Math.ceil(filteredHouses.length / housesPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredHouses.length / housesPerPage)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}










// 'use client'
// import { useState, useEffect } from 'react'
// import Layout from '../../components/Layout'
// import HouseCard from '../../components/HouseCard'
// import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
// import { useSelector, useDispatch } from 'react-redux'
// import { RootState } from '../../store'
// import { setLocation, setPriceRange, setBedrooms, resetFilters } from '../../store/filterSlice'
// import { api } from '@/app/lib/api/client'


// interface House {
//   id: number;
//   title: string;
//   price: number;
//   location: string;
//   bedrooms: number;
//   amenities?: string[];
//   imageUrl: string; // New property for a single image
//   image_urls:string[],
//   owner_id: number; // Owner's ID
//   likeCount: number; // Number of likes
//   bathrooms: number
//   // ownerId for comparison
//   userId: number  // Current logged-in user's ID
//   onDelete: (id: number) => void
//   reviews: {
//     reviewerId: number;
//     reviewerName: string;
//     rating: number;
//     comment: string;
//   }[]; // Array of reviews
//   [key: string]: unknown; // To handle any other dynamic fields
// }



// export default function Houses() {
//   const dispatch = useDispatch()
//   const { location, minPrice, maxPrice, bedrooms } = useSelector((state: RootState) => state.filter)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [houses, setHouses] = useState([]); // Explicitly typed array of House

//   const [loading, setLoading] = useState(true)
//   const housesPerPage = 6

//   useEffect(() => {
//     fetchHouses()
//   }, [])

//   const fetchHouses = async () => {
//     try {
//       const response = await api.get('apis/houses/all'); // Explicit API response type
//       const houses = response.data.houses;
 
//       setHouses(houses);
//       // console.log(formattedHouses)
//     } catch (error) {
//       console.error('Failed to fetch houses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   console.log(houses)
//   const filteredHouses = houses.filter((house:House) => {
//     const title = house.title || '';
//     const locationValue = house.location || '';
//     const locationCheck = !location || locationValue.toLowerCase() === location.toLowerCase();
//     const bedroomsCheck = !bedrooms || house.bedrooms >= 10;
  
//     return (
//       title.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       house.price >= (minPrice || 0) &&
//       house.price <= (maxPrice || Infinity) &&
//       locationCheck &&
//       bedroomsCheck
//     );
//   });
//   console.log(filteredHouses)
  

//   const indexOfLastHouse = currentPage * housesPerPage
//   const indexOfFirstHouse = indexOfLastHouse - housesPerPage
//   const currentHouses = filteredHouses.slice(indexOfFirstHouse, indexOfLastHouse)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     dispatch(setLocation(e.target.value))
//   }

//   const handlePriceRangeChange = (min: number, max: number) => {
//     dispatch(setPriceRange({ min, max }))
//   }

//   const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     dispatch(setBedrooms(parseInt(e.target.value)))
//   }

//   const handleResetFilters = () => {
//     dispatch(resetFilters())
//   }

//   return (
//     <Layout title="Houses | House Listing Platform">
//       <div className="flex flex-col md:flex-row gap-8">
//         <aside className="w-full md:w-1/4">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
//             <div className="mb-4">
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Location
//               </label>
//               <select
//                 id="location"
//                 className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={location}
//                 onChange={handleLocationChange}
//               >
//                 <option value="">All Locations</option>
//                 <option value="Countryside">Countryside</option>
//                 <option value="Downtown">Downtown</option>
//                 <option value="Beach Town">Beach Town</option>
//                 <option value="Alps">Alps</option>
//                 <option value="Metropolis">Metropolis</option>
//                 <option value="Suburbs">Suburbs</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Min Price
//               </label>
//               <input
//                 type="number"
//                 id="min-price"
//                 className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={minPrice}
//                 onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), maxPrice)}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Max Price
//               </label>
//               <input
//                 type="number"
//                 id="max-price"
//                 className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={maxPrice}
//                 onChange={(e) => handlePriceRangeChange(minPrice, parseInt(e.target.value))}
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Minimum Bedrooms
//               </label>
//               <select
//                 id="bedrooms"
//                 className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={bedrooms}
//                 onChange={handleBedroomsChange}
//               >
//                 <option value="">Any</option>
//                 <option value="1">1+</option>
//                 <option value="2">2+</option>
//                 <option value="3">3+</option>
//                 <option value="4">4+</option>
//               </select>
//             </div>
//             <button
//               onClick={handleResetFilters}
//               className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </aside>
//         <main className="w-full md:w-3/4">
//           <div className="mb-6">
//             <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
//               <input
//                 type="text"
//                 placeholder="Search for houses..."
//                 className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition duration-200">
//                 <Search className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//           {loading ? (
//             <h1>Loading..</h1>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {houses.map((house:House) => (
                 
//                 <HouseCard key={house.id} {...house} />
//               ))}
//             </div>
//           )}
//           {filteredHouses.length === 0 && !loading && (
//             <p className="text-center text-gray-600 dark:text-gray-400 mt-8">No houses found matching your criteria.</p>
//           )}
//           {filteredHouses.length > housesPerPage && (
//             <div className="mt-8 flex justify-center">
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   <span className="sr-only">Previous</span>
//                   <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//                 </button>
//                 {Array.from({ length: Math.ceil(filteredHouses.length / housesPerPage) }).map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => paginate(index + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium ${
//                       currentPage === index + 1
//                         ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
//                         : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
//                     }`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === Math.ceil(filteredHouses.length / housesPerPage)}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   <span className="sr-only">Next</span>
//                   <ChevronRight className="h-5 w-5" aria-hidden="true" />
//                 </button>
//               </nav>
//             </div>
//           )}
//         </main>
//       </div>
//     </Layout>
//   )
// }
