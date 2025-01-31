// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_URL } from './utils/config';
// Note: You cannot use useDispatch or call login() directly in middleware.

const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/password-reset',
  '/auth/oauth',
  '/auth/verify-email',
  '/auth/password-reset-request',
  '/auth/password-reset-confirmation'
];

const publicRoutes = ['/', '/about', '/privacy&policy', '/terms', '/blog', '/houses'];

const protectedRoutePatterns = [
  /^\/profile\/update$/,       // /profile/update
  /^\/profile\/[^/]+$/,         // /profile/[id]
  /^\/houses\/new$/,            // /houses/new
  /^\/houses\/[^/]+$/,          // /houses/[id]
  /^\/contact$/,               // /contact
  /^\/dashboard$/,             // /dashboard
  /^\/cart-page$/,             // /cart-page
  /^\/booking(\/.*)?$/,        // /booking and any sub-route
  /^\/blog\/[^/]+$/,           // /blog/[id]
  /^\/blog\/add-blog$/         // /blog/add-blog
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  // Get tokens and user info from cookies
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const userCookie = cookieStore.get('user')?.value; // Stored as JSON

  // -----------------------------------------------------
  // 1. Auth Routes: If user is logged in, redirect away from auth pages.
  // -----------------------------------------------------
  if (authRoutes.includes(pathname)) {
    if (accessToken && refreshToken && userCookie) {
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
    // If tokens or user info are missing, force a login.
    if (!accessToken || !refreshToken || !userCookie) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verify the access token.
      const isValid = await verifyAccessToken(accessToken);

      let updatedAccessToken = accessToken;
      let updatedRefreshToken = refreshToken;

      // If access token is invalid, try refreshing it.
      if (!isValid) {
        const newTokens = await refreshTokens(refreshToken);
        if (!newTokens) {
          throw new Error('Token refresh failed');
        }
        updatedAccessToken = newTokens.access_token;
        updatedRefreshToken = newTokens.refresh_token;
      }

      // Fetch user data from your backend.
      // This ensures we have the latest user info and can pass it to the client.
      const userResponse = await fetch(`${BASE_URL}users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${updatedAccessToken}`,
        },
      });
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();

      // Build the response and set the updated tokens and user info as cookies.
      const response = NextResponse.next();
      response.cookies.set('access_token', updatedAccessToken, {
        httpOnly: false,
        secure:true,
        sameSite: 'strict',
        maxAge: 1450,
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
      return response;
    } catch (error) {
      console.error('Authentication error:', error);
      // On error, clear tokens and redirect to login.
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      response.cookies.delete('user');
      return response;
    }
  }

  // -----------------------------------------------------
  // 4. Default: Continue for any other routes not explicitly handled.
  // -----------------------------------------------------
  return NextResponse.next();
}

// Helper function to verify the access token.
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

// Helper function to refresh tokens using the refresh token.
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
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
