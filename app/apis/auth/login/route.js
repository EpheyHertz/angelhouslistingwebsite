import { api } from '../../../lib/api/server';

export async function POST(req) {
  try {
    // Parse the request body as JSON
    const body = await req.json();
    const { email, password } = body;
   

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // Create form-encoded data
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    // Step 1: Login to get the access token
    const loginResponse = await api.post(
      "/users/login",
      formData.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

   

    const { access_token } = loginResponse.data;

    if (!access_token) {
      throw new Error('Access token not received');
    }

    // Step 2: Fetch the user profile using the access token
    const userResponse = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Combine login data and user data
    const combinedData = {
      token: loginResponse.data,
      user: userResponse.data,
    };

    // Return combined response
    return new Response(JSON.stringify(combinedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // console.error("Error:", error);

    const status = error.response?.status || 500;
    let errorMessage = "Something went wrong on the server";

    if (status === 400) {
      errorMessage = "Invalid email or password. Please check your credentials.";
    } else if (status === 403) {
      errorMessage = "Please authorize your account to proceed.Ensure you have verified your email address.";
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
