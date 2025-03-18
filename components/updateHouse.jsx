'use client'
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify"; // Ensure react-toastify is installed

const EditHouseDetails = ({ house, handleUpdateHouse, setIsEditing,updateError }) => {
  const [formData, setFormData] = useState({
    title: house.title,
    location: house.location,
    price: house.price,
    deposit: house.deposit,
    description: house.description,
    images: house.images || [],
    amenities: house.amenities || "",
    room_no: house.bedrooms || "",
    currency: house.currency || "KES", // Default to USD if no currency is provided
  });

  const [imagePreviews, setImagePreviews] = useState(house.images || []);
  const [currencies, setCurrencies] = useState([]); // State to store currency data
  const [loading, setLoading] = useState(true); // Loading state for API call

  useEffect(() => {
    // Fetch currencies from the API
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        const currencyCodes = Object.keys(data.rates); // Extract currency codes
        setCurrencies(currencyCodes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = [...files];
    const newImagePreviews = [...imagePreviews];

    for (let i = 0; i < files.length; i++) {
      newImagePreviews.push(URL.createObjectURL(files[i]));
    }

    setFormData({ ...formData, images: [...formData.images, ...newImages] });
    setImagePreviews(newImagePreviews);
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviews];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("location", formData.location);
    updatedData.append("price", formData.price);
    updatedData.append("deposit", formData.deposit);
    updatedData.append("description", formData.description);
    updatedData.append("amenities", formData.amenities);
    updatedData.append("room_count", formData.room_no);
    updatedData.append("currency", formData.currency); // Append currency to form data

    formData.images.forEach((image) => {
      updatedData.append("images", image);
    });

    handleUpdateHouse(updatedData,house.id);
   
    toast.success("House details updated successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit House Details</h2>
        {updateError?<h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-600">{updateError}</h2>:''}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            required
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            required
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            required
          />
          <input
            type="number"
            name="deposit"
            value={formData.deposit}
            onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            rows={4}
            required
          />

          {/* Amenities */}
          <textarea
            name="amenities"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            placeholder="List amenities (e.g., Wi-Fi, AC, Swimming Pool)"
            rows={3}
          />

          {/* Room Number */}
          <input
            type="text"
            name="room_no"
            value={formData.room_no}
            onChange={(e) => setFormData({ ...formData, room_no: e.target.value })}
            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            placeholder="Room Number (e.g., 101)"
            required
          />

          {/* Currency Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            {loading ? (
              <p>Loading currencies...</p>
            ) : (
              <select
                name="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 mb-3 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                {currencies.map((currency, index) => (
                  <option key={index} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Image Uploads */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Images (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="w-full text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 mb-2"
            />
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditHouseDetails;
