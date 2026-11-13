import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface IBrand {
  _id: string
  name: string
  status: 'active' | 'inactive'
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface BrandResponse {
  success: boolean
  statusCode: number
  message: string
  data: IBrand | IBrand[]
}

export const brandApi = createApi({
  reducerPath: 'brandApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token

      console.log('TOKEN =>', token)

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json')

      return headers
    },
  }),

  tagTypes: ['Brand'],

  endpoints: (builder) => ({
    getBrand: builder.query<IBrand[], void>({
      query: () => ({
        url: '/brands',
        method: 'GET',
      }),

      transformResponse: (response: BrandResponse): IBrand[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Brand'],
    }),

    // single
    getBrandById: builder.query<IBrand, string>({
      query: (id) => `/brands/${id}`,
      transformResponse: (response: BrandResponse) => response.data as IBrand,
      providesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),

    // create team api
    createBrand: builder.mutation<IBrand, FormData>({
      query: (formData) => ({
        url: '/brands',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: BrandResponse) => response.data as IBrand,

      invalidatesTags: ['Brand'],
    }),

    // update team api
    updateBrand: builder.mutation<IBrand, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: BrandResponse) => response.data as IBrand,
      invalidatesTags: ['Brand'],
    }),

    // delete team api
    deleteBrand: builder.mutation<IBrand, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: BrandResponse) => response.data as IBrand,

      invalidatesTags: ['Brand'],
    }),
  }),
})

export const { useGetBrandQuery, useGetBrandByIdQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } = brandApi
