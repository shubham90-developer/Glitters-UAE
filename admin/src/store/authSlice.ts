'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  user: any | null
  isAuthenticated: boolean
}

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const initialState: AuthState = {
  token: getToken(),
  user: null,
  isAuthenticated: !!getToken(),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true

      if (typeof window !== 'undefined') {
        // localStorage
        localStorage.setItem('token', action.payload.token)

        // cookie for middleware
        document.cookie = `token=${action.payload.token}; path=/`
      }
    },

    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')

        // remove cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
