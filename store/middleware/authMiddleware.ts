import { Middleware } from '@reduxjs/toolkit'
import { login, logout } from '../authSlice'
import Cookies from 'js-cookie'

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  if (login.match(action)) {
    const { access_token, refresh_token } = action.payload
    Cookies.set('access_token', access_token, { secure: true, sameSite: 'strict' })
    Cookies.set('refresh_token', refresh_token, { secure: true, sameSite: 'strict' })
  } else if (logout.match(action)) {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
  }

  return next(action)
}

