// hooks/useExchangeRate.js
import { useState, useEffect } from 'react';

export default function useExchangeRate() {
  const [rate, setRate] = useState(133); // Fallback rate
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        setRate(data.rates.KES || 133); // Fallback if KES not found
      } catch (error) {
        console.error("Using fallback rate due to error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { rate, loading };
}