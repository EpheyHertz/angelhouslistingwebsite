import React, { useState } from 'react';
import HouseCard from '../HouseCard';

const HousesList = ({ activeTab, houses, user }) => {
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark/light mode
  const housesPerPage = 3; // Number of houses to display per page

  // Calculate the houses to display for the current page
  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = houses.slice(indexOfFirstHouse, indexOfLastHouse);

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      {/* Dark/Light Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 bg-blue-500 text-white rounded"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Check the active tab first */}
      {activeTab === 'listings' ? (
        // If the active tab is 'listings', check if houses exist
        houses.length > 0 ? (
          // If houses exist, render the houses and pagination
          <div>
            {/* House Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {currentHouses.map((house) => (
                <div
                  key={house.id}
                  className={`rounded-lg shadow-md p-4 transform transition-transform hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <HouseCard {...house} owner_id={user?.id} userId={user?.id} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              {Array.from(
                { length: Math.ceil(houses.length / housesPerPage) },
                (_, i) => (
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
                )
              )}
            </div>
          </div>
        ) : (
          // If no houses exist, show a message
          <p
            className={`text-center mt-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            No houses available.
          </p>
        )
      ) : (
        // If the active tab is not 'listings', render nothing or a placeholder
        <p
          className={`text-center mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Please select the 'listings' tab to view houses.
        </p>
      )}
    </div>
  );
};

export default HousesList;