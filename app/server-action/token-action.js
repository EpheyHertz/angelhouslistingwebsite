'use server';

import { cookies } from 'next/headers';

// Utility function to retrieve authentication headers

export async function getAuthHeaders() {
    const accessToken = getCookie('access_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }

// Function to get a specific cookie value using Next.js cookies
export async function  getCookie(cookieName) {
  const cookieStore = await cookies(); // Synchronous call to `cookies()` from Next.js
  return cookieStore.get(cookieName)?.value || null;
}

// Example usage
(async () => {
  const headers = await getAuthHeaders();
  if (headers) {
    console.log(headers);
    // Use `headers` in your API requests
  }
})();

  