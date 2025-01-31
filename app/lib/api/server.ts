import axios from 'axios'
import { cookies } from 'next/headers'
import { BASE_URL } from '../../../utils/config';

const baseURL = process.env.NEXT_PUBLIC_API_URL|| BASE_URL || 'http://localhost:8000/'

const api = axios.create({ baseURL })

api.interceptors.request.use(
  async (config) => {
    try {
      const cookieStore = await cookies()
      const access_token = cookieStore.get('access_token')?.value // Ensure this resolves properly
      if (access_token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${access_token}`
      }
    } catch (error) {
      console.error('Error in server-side interceptor:', error)
    }
    return config
  },
  async (error) => {
    console.error('Server-side interceptor error:', error)
    return Promise.reject(error)
  }
)

export { api }
