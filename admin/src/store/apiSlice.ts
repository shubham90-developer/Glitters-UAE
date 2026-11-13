import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface LoginRequest {
  email: string
  password: string
}

export interface AdminData {
  _id: string
  name: string
  email: string
  role: string
  status: string
}

export interface LoginResponse {
  success: boolean
  statusCode: number
  message: string
  token: string
  data: AdminData
}

export interface AdminProfileResponse {
  success: boolean
  data: AdminData
}

// at least one of newEmail / newPassword is required by the backend
export interface ChangeCredentialsRequest {
  currentPassword: string
  newEmail?: string
  newPassword?: string
}

// backend returns a fresh token, same shape as login
export type ChangeCredentialsResponse = LoginResponse

export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState).auth?.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json')

      return headers
    },
  }),

  tagTypes: ['Admin'],

  endpoints: (builder) => ({
    // POST /admin-auth/signin
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/admin-auth/signin',
        method: 'POST',
        body: credentials,
      }),
    }),

    // GET /admin-auth/me  (sends Bearer token via prepareHeaders)
    getMe: builder.query<AdminProfileResponse, void>({
      query: () => ({
        url: '/admin-auth/me',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    // PUT /admin-auth/change-credentials  (sends Bearer token via prepareHeaders)
    changeCredentials: builder.mutation<ChangeCredentialsResponse, ChangeCredentialsRequest>({
      query: (body) => ({
        url: '/admin-auth/change-credentials',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useChangeCredentialsMutation } = apiSlice
