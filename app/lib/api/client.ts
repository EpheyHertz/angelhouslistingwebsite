import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'

const api = axios.create({ baseURL })
api.interceptors.request.use(
  async (config) => {
    try {
      const access_token = await new Promise((resolve) => {
        const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")
        resolve(decodeURIComponent(cookie))
      })

      if (access_token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${access_token}`
      }
    } catch (error) {
      console.error('Error in client-side interceptor:', error)
    }
    return config
  },
  async (error) => {
    console.error('Client-side interceptor error:', error)
    return Promise.reject(error)
  }
)

export { api }
