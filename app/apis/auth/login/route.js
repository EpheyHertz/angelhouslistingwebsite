
import {api} from '../../../lib/api/server'

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
      `/users/login`,
      formData.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    

    const { access_token } = loginResponse.data;

    if (!access_token) {
      throw new Error('Access token not received');
    }

    // Step 2: Fetch the user profile using the access token
    const userResponse = await api.get(`/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
   console.log("User:",userResponse)
    // Combine login data and user data
    const combinedData = {
      token: loginResponse.data,
      user: userResponse.data,
    };
    console.log("Full Response", combinedData)  

    // Return combined response

    return new Response(JSON.stringify(combinedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle errors (e.g., network issues or backend errors)
    const status = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.detail || 'Something went wrong on the server';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
