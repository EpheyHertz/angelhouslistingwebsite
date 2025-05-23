import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: number
    username: string
    full_name: string
    email: string
    contact_number: string | null
    location: string | null
    profile_image: string | null
    role: 'regular_user' | 'admin'| 'house_owner'
    is_verified: boolean
    verification_status: string
    phone_number: number|null
    address: number|null
    zipcode: number|null
    created_at: string
    updated_at: string | null
    last_name:string | null
    first_name:string | null
    state:string | null
    country:string | null
  } | null
  accessToken: string | null
  refreshToken: string | null
  token_expiry: string | null
  token_refreshed_at: string | null
}
const storeInCookies = (key: string, value: string) => {
  Cookies.set(key, value, { secure: true, sameSite: 'strict', expires: 7 }) // 7-day expiry
}

const getFromCookies = (key: string): string | null => {
  return Cookies.get(key) || null
}



const initialState: AuthState = {
  isAuthenticated: !!getFromCookies('access_token'),
  user: getFromCookies('user') ? JSON.parse(getFromCookies('user')!) : null,
  accessToken: getFromCookies('access_token'),
  refreshToken: getFromCookies('refresh_token'),
  token_expiry: getFromCookies('token_expiry'),
 token_refreshed_at:getFromCookies('token_refreshed_at')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        access_token: string
        refresh_token: string
        token_expiry: string
        token_refreshed_at: string
        user: AuthState['user']
      }>
    ) => {
      state.isAuthenticated = true
      state.accessToken = action.payload.access_token
      state.refreshToken = action.payload.refresh_token
      state.token_expiry = action.payload.token_expiry
      state.token_refreshed_at = action.payload.token_refreshed_at
      state.user = action.payload.user

      // Store in cookies
      storeInCookies('access_token', action.payload.access_token)
      storeInCookies('refresh_token', action.payload.refresh_token)
      storeInCookies('token_refreshed_at', action.payload.token_refreshed_at)
      storeInCookies('token_expiry', action.payload.token_expiry)
      storeInCookies('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      // Remove cookies with the same attributes as set
      Cookies.remove('access_token', { secure: true, sameSite: 'strict' })
      Cookies.remove('refresh_token', { secure: true, sameSite: 'strict' })
      Cookies.remove('token_expiry', { secure: true, sameSite: 'strict' })
      Cookies.remove('token_refreshed_at', { secure: true, sameSite: 'strict' })
      Cookies.remove('user', { secure: true, sameSite: 'strict' })
    
      // Reset Redux state
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.token_expiry = null
      state.token_refreshed_at = null
    }
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
