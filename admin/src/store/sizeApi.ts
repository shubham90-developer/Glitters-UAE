import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ISize {
  _id: string
  size: string
  status: 'active' | 'inactive'
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface SizeResponse {
  success: boolean
  statusCode: number
  message: string
  data: ISize | ISize[]
}

export const sizeApi = createApi({
  reducerPath: 'sizeApi',

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

  tagTypes: ['Size'],

  endpoints: (builder) => ({
    getSize: builder.query<ISize[], void>({
      query: () => ({
        url: '/size',
        method: 'GET',
      }),

      transformResponse: (response: SizeResponse): ISize[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Size'],
    }),

    // single
    getSizeById: builder.query<ISize, string>({
      query: (id) => `/size/${id}`,
      transformResponse: (response: SizeResponse) => response.data as ISize,
      providesTags: (result, error, id) => [{ type: 'Size', id }],
    }),

    // create team api
    createSize: builder.mutation<ISize, FormData>({
      query: (formData) => ({
        url: '/size',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: SizeResponse) => response.data as ISize,

      invalidatesTags: ['Size'],
    }),

    // update team api
    updateSize: builder.mutation<ISize, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/size/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: SizeResponse) => response.data as ISize,
      invalidatesTags: ['Size'],
    }),

    // delete team api
    deleteSize: builder.mutation<ISize, string>({
      query: (id) => ({
        url: `/size/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: SizeResponse) => response.data as ISize,

      invalidatesTags: ['Size'],
    }),
  }),
})

export const { useGetSizeQuery, useGetSizeByIdQuery, useCreateSizeMutation, useUpdateSizeMutation, useDeleteSizeMutation } = sizeApi
