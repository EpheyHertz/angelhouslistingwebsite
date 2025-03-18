'use server';

import axios from 'axios';

export default async function chat({ 
  message, 
  thread_id 
}: { 
  message: string;
  thread_id?: string;
}) {
  try {
    // Create the payload object with the message
    const payload: { message: string; thread_id?: string } = { message };
    
    // Add thread_id to payload if it exists
    if (thread_id) {
      payload.thread_id = thread_id;
    }

    // Make the API request
    const response = await axios.post(
      'https://comradehomeschatbot.onrender.com/chat/us', 
      payload
    );

    // Validate the response
    if (response.status !== 200) {
      throw new Error('Failed to get response from chat service');
    }

    // Check if the response has the expected structure
    const data = response.data;
    if (!data || typeof data.response !== 'string') {
      throw new Error('Invalid response format from chat service');
    }

    return { 
      success: true, 
      response: data  // The full response including thread_id, response, and message_history
    };
  } catch (error) {
    console.error('Chat API error:', error);
    // Return a plain string instead of the error object
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, response: errorMessage };
  }
}