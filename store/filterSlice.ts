import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FilterState {
  location: string
  minPrice: number
  maxPrice: number
  bedrooms: number
}

const initialState: FilterState = {
  location: '',
  minPrice: 0,
  maxPrice: 1000000,
  bedrooms: 0,
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.minPrice = action.payload.min
      state.maxPrice = action.payload.max
    },
    setBedrooms: (state, action: PayloadAction<number>) => {
      state.bedrooms = action.payload
    },
    resetFilters: (state) => {
      return initialState
    },
  },
})

export const { setLocation, setPriceRange, setBedrooms, resetFilters } = filterSlice.actions
export default filterSlice.reducer

