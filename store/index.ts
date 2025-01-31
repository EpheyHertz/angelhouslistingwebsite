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

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

