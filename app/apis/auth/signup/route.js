





import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // To generate unique image names
import { api } from '../../../lib/api/server';

export const config = {
  api: {
    bodyParser: true, // Use the default body parser for application/json
  },
};

export async function POST(req) {
  try {
    // Parse the incoming JSON data
    const data = await req.json();
    console.log(data);

    // Extract user details from the request body
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      country,
      state,
      address,
      zipcode,
      phoneNumber,
      profilePicture, // Assuming the base64 image is provided in the request
    } = data;

    // Validate required fields
    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !country ||
      !state ||
      !address ||
      !zipcode ||
      !phoneNumber
    ) {
      return new Response(
        JSON.stringify({ message: "Please fill all required fields." }),
        { status: 400 }
      );
    }

    // Capitalize first name and last name, then combine them into full_name
    const fullName = `${capitalize(firstName)} ${capitalize(lastName)}`;

    // Format the location as a combined string of country and state
    const location = `${country}, ${state}`;

    // Prepare the user data to be sent to the backend
    const userData = {
      username: username.replace(/\s+/g, ""), // Remove spaces from username
      full_name: fullName, // Full name in the format "First Last"
      email,
      password,
      first_name: capitalize(firstName), // Correct field name in backend
      last_name: capitalize(lastName), // Correct field name in backend
      country,
      state,
      address,
      zipcode,
      phone_number: phoneNumber, // Correct field name in backend
      location, // Add the formatted location
      profile_image:null
    };

    // Handle profile picture (if provided as base64)
    if (profilePicture) {
      // Ensure that the profile image is a valid base64 string
      const match = profilePicture.match(/^data:(image\/[a-zA-Z]+);base64,/);
      if (!match) {
        return new Response(
          JSON.stringify({ message: "Invalid image format. Please provide a valid image." }),
          { status: 400 }
        );
      }

      const mimeType = match[1]; // Extract MIME type (e.g., image/png)
      const extension = mimeType.split('/')[1]; // Get the file extension (e.g., png)
      const base64Data = profilePicture.split(',')[1]; // Get the actual base64 data

      try {
        // Generate a unique file name and save the image in the 'public/uploads' folder
        const imageName = `${uuidv4()}.${extension}`;
        const imagePath = path.join(process.cwd(), 'public', 'uploads', imageName);

        // Decode the base64 string and write it to a file
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(imagePath, buffer);

        // Update the user data with the image path for the profile image
        userData.profile_image = `/uploads/${imageName}`;
        userData.profile_image_content_type = mimeType; // Include the MIME type
      } catch (error) {
        console.error("Failed to process profile image:", error);
        return new Response(
          JSON.stringify({ message: "Failed to process profile image." }),
          { status: 400 }
        );
      }
    }

    // Send the user data to your backend using axios
    // const backendUrl = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/users/register';
    const response = await api.post('/users/register', userData);
    console.log(response)

    // If the user was successfully created in the backend, respond with the success message
    if (response.status === 201) {
      return new Response(
        JSON.stringify({ message: "User created successfully!" }),
        { status: 201 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Failed to create user in backend." }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in form handling:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error. Please try again later." }),
      { status: 500 }
    );
  }
}

// Capitalize function for first and last names
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
