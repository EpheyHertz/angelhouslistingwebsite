"use client"
import { useState, useEffect } from 'react'

const CountrySelect = ({ value, onChange }) => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const sortedCountries = data
          .map(country => ({
            name: country.name.common,
            code: country.cca2,
            phone: country.idd.root + (country.idd.suffixes?.[0] || '')
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
        setCountries(sortedCountries)
      })
      .catch(error => console.error('Error fetching countries:', error))
  }, [])

  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select a country</option>
      {countries.map(country => (
        <option key={country.code} value={country.code} data-phone={country.phone}>
          {country.name}
        </option>
      ))}
    </select>
  )
}

export default CountrySelect

