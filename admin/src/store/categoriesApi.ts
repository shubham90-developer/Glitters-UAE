import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ICategory {
  data: ICategory
  _id: string
  img: string
  categoryName: string
  categoryDesc: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface CategoryResponse {
  success: boolean
  statusCode: number
  message: string
  data: ICategory | ICategory[]
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',

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

  tagTypes: ['Category'],

  endpoints: (builder) => ({
    getcategory: builder.query<ICategory[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),

      transformResponse: (response: CategoryResponse): ICategory[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Category'],
    }),

    // single
    getcategoryById: builder.query<ICategory, string>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: CategoryResponse) => response.data as ICategory,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // create team api
    createcategory: builder.mutation<ICategory, FormData>({
      query: (formData) => ({
        url: '/categories',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: CategoryResponse) => response.data as ICategory,

      invalidatesTags: ['Category'],
    }),

    // update team api
    updatecategory: builder.mutation<ICategory, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: CategoryResponse) => response.data as ICategory,
      invalidatesTags: ['Category'],
    }),

    // delete team api
    deletecategory: builder.mutation<ICategory, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: CategoryResponse) => response.data as ICategory,

      invalidatesTags: ['Category'],
    }),
  }),
})

export const { useGetcategoryQuery, useGetcategoryByIdQuery, useCreatecategoryMutation, useUpdatecategoryMutation, useDeletecategoryMutation } =
  categoryApi
