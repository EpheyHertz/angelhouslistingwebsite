// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_URL } from './utils/config';

// Routes that are for authentication purposes
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/password-reset',
  '/auth/oauth',
  '/auth/verify-email',
  '/auth/password-reset-request',
  '/auth/password-reset-confirmation'
];

// Routes that are always accessible without authentication
const publicRoutes = ['/', '/about', '/privacy&policy', '/terms', '/blog', '/houses'];

// Patterns for routes that require authentication
const protectedRoutePatterns = [
  /^\/profile\/update$/,       // /profile/update
  /^\/profile\/[^/]+$/,        // /profile/[id]
  /^\/houses\/new$/,           // /houses/new
  /^\/houses\/[^/]+\/edit$/,   // /houses/[id]/edit
  /^\/houses\/[^/]+$/,         // /houses/[id]
  /^\/contact$/,               // /contact
  /^\/dashboard$/,             // /dashboard
  /^\/cart-page$/,             // /cart-page
  /^\/booking(\/.*)?$/,        // /booking and any sub-route
  /^\/blog\/[^/]+$/,           // /blog/[id]
  /^\/blog\/add-blog$/         // /blog/add-blog
];

// Token refresh timeout to prevent excessive requests
const TOKEN_REFRESH_THRESHOLD = 300; // seconds (5 minutes) before expiry to refresh

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const cookieStore = await cookies();
  
  // Get tokens and user info from cookies
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const userCookie = cookieStore.get('user')?.value;
  const tokenExpiry = cookieStore.get('token_expiry')?.value;
  const tokenRefreshedAt = cookieStore.get('token_refreshed_at')?.value;

  // -----------------------------------------------------
  // 1. Auth Routes: If user is logged in, redirect away from auth pages.
  // -----------------------------------------------------
  if (authRoutes.includes(pathname)) {
    if (accessToken && refreshToken && userCookie) {
      // If there's a requested page in the URL, redirect there after login
      const redirectTo = request.nextUrl.searchParams.get('redirect');
      
      if (redirectTo) {
        try {
          // Decode the redirect URL (it might have been encoded)
          const decodedRedirect = decodeURIComponent(redirectTo);
          
          // Make sure it's not an auth route (prevent redirect loops)
          if (!authRoutes.some(route => decodedRedirect.startsWith(route))) {
            // Use the decoded path for redirection
            return NextResponse.redirect(new URL(decodedRedirect, request.url));
          }
        } catch (error) {
          console.error('Error decoding redirect URL:', error);
          // If there's an error decoding, proceed to dashboard
        }
      }
      
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // -----------------------------------------------------
  // 2. Public Routes: No protection required.
  // -----------------------------------------------------
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // -----------------------------------------------------
  // 3. Protected Routes: Check if the pathname matches any protected route pattern.
  // -----------------------------------------------------
  const isProtected = protectedRoutePatterns.some((pattern) => pattern.test(pathname));
  
  if (isProtected) {
    // If tokens or user info are missing, force a login and store the requested URL
    if (!accessToken || !refreshToken || !userCookie) {
      const loginUrl = new URL('/auth/login', request.url);
      // Properly encode the redirect URL to handle special characters and preserve query params
      const fullPath = pathname + search;
      loginUrl.searchParams.set('redirect', encodeURIComponent(fullPath));
      
      // Debug log to see the redirect URL
      console.log(`Redirecting unauthenticated request to: ${loginUrl.toString()}`);
      
      return NextResponse.redirect(loginUrl);
    }

    // Check if we need to validate or refresh the token
    const now = Math.floor(Date.now() / 1000);
    const shouldSkipRefresh = tokenRefreshedAt && (now - parseInt(tokenRefreshedAt) < 60); // Throttle refresh attempts (1 minute)
    
    try {
      let updatedAccessToken = accessToken;
      let updatedRefreshToken = refreshToken;
      let updatedTokenExpiry = tokenExpiry;
      let needsTokenRefresh = false;
      
      // Determine if we need to verify/refresh the token
      if (!shouldSkipRefresh) {
        // Check if token is close to expiry
        if (tokenExpiry && now + TOKEN_REFRESH_THRESHOLD >= parseInt(tokenExpiry)) {
          needsTokenRefresh = true;
        } 
        // Verify token only if we don't have expiry info or not refreshing yet
        else if (!tokenExpiry) {
          const isValid = await verifyAccessToken(accessToken);
          needsTokenRefresh = !isValid;
        }

        // Refresh token if needed
        if (needsTokenRefresh) {
          console.log('Refreshing token...');
          const newTokens = await refreshTokens(refreshToken);
          if (!newTokens) {
            throw new Error('Token refresh failed');
          }
          updatedAccessToken = newTokens.access_token;
          updatedRefreshToken = newTokens.refresh_token;
          updatedTokenExpiry = String(now + (newTokens.expires_in || 1450)); // Store expiry time
          
          // Only fetch user data if tokens were refreshed to minimize requests
          const userData = await fetchUserData(updatedAccessToken);
          
          // Build the response and set the updated tokens and user info as cookies
          const response = NextResponse.next();
          response.cookies.set('access_token', updatedAccessToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: newTokens.expires_in || 1450,
          });
          response.cookies.set('refresh_token', updatedRefreshToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 604800, // 7 days
          });
          response.cookies.set('user', JSON.stringify(userData), {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 604800,
          });
          response.cookies.set('token_expiry', updatedTokenExpiry, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 604800,
          });
          response.cookies.set('token_refreshed_at', String(now), {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 604800,
          });
          return response;
        }
      }
      
      // Token is still valid, proceed without server requests
      return NextResponse.next();
    } catch (error) {
      console.error('Authentication error:', error);
      // On error, clear tokens and redirect to login with return URL
      const loginUrl = new URL('/auth/login', request.url);
      const fullPath = pathname + search;
      loginUrl.searchParams.set('redirect', encodeURIComponent(fullPath));
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      response.cookies.delete('user');
      response.cookies.delete('token_expiry');
      response.cookies.delete('token_refreshed_at');
      return response;
    }
  }

  // -----------------------------------------------------
  // 4. Default: Continue for any other routes not explicitly handled.
  // -----------------------------------------------------
  return NextResponse.next();
}

// Helper function to verify the access token
async function verifyAccessToken(token) {
  try {
    const response = await fetch(`${BASE_URL}users/verify/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error verifying access token:', error);
    return false;
  }
}

// Helper function to refresh tokens using the refresh token
async function refreshTokens(refreshToken) {
  try {
    const response = await fetch(`${BASE_URL}tokens/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in // Make sure your API returns this
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

// Helper function to fetch user data
async function fetchUserData(accessToken) {
  const userResponse = await fetch(`${BASE_URL}users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!userResponse.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  return await userResponse.json();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico).*)',
  ],
};