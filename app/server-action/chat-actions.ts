'use server';
import axios from 'axios';

export default async function chat({ message }: { message: string }) {
  try {
    const response = await axios.post('https://comradehomeschatbot.onrender.com/chat/us', { message });
    if (response.status !== 200) {
      throw new Error('Error');
    }
    return { success: true, response: response.data.response };
  } catch (error) {
    // Return a plain string instead of the error object
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return { success: false, response: errorMessage };
  }
}
