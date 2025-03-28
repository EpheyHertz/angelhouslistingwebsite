import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import filterReducer from './filterSlice'
import { authMiddleware } from './middleware/authMiddleware'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
})

