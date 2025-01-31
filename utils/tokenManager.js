import { login } from '../store/authSlice'

export const handleTokenFromRedirect = (dispatch) => {
  const urlParams = new URLSearchParams(window.location.hash.slice(1))
  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')

  if (accessToken && refreshToken) {
    dispatch(login({ accessToken, refreshToken }))
    
    // Clear the tokens from the URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

