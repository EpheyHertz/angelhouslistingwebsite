import React, { useState } from 'react';
import HouseCard from '../HouseCard';

const HousesList = ({ activeTab, houses = [], user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const housesPerPage = 3;

  // Ensure houses is always an array
  const validHouses = Array.isArray(houses) ? houses : [];

  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = validHouses.slice(indexOfFirstHouse, indexOfLastHouse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 bg-blue-500 text-white rounded"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {activeTab === 'listings' ? (
        validHouses.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {currentHouses.map((house) => (
                <div
                  key={house.id}
                  className={`rounded-lg shadow-md p-4 transform transition-transform hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  <HouseCard {...house} owner_id={user?.id} userId={user?.id} />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(validHouses.length / housesPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className={`text-center mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No houses available.
          </p>
        )
      ) : (
        <p className={`text-center mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Please select the 'listings' tab to view houses.
        </p>
      )}
    </div>
  );
};

export default HousesList;
