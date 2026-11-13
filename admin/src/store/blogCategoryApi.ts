import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface IBlogCategory {
  categoryName: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface BlogCategoryResponse {
  success: boolean
  statusCode: number
  message: string
  data: IBlogCategory | IBlogCategory[]
}

export const blogCategoryApi = createApi({
  reducerPath: 'blogCategoryApi',

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
    getBlogCategory: builder.query<IBlogCategory[], void>({
      query: () => ({
        url: '/blogs-category',
        method: 'GET',
      }),

      transformResponse: (response: BlogCategoryResponse): IBlogCategory[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Category'],
    }),

    // single
    getBlogCategoryById: builder.query<IBlogCategory, string>({
      query: (id) => `/blogs-category/${id}`,
      transformResponse: (response: BlogCategoryResponse) => response.data as IBlogCategory,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // create team api
    createBlogCategory: builder.mutation<IBlogCategory, FormData>({
      query: (formData) => ({
        url: '/blogs-category',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: BlogCategoryResponse) => response.data as IBlogCategory,

      invalidatesTags: ['Category'],
    }),

    updateBlogCategory: builder.mutation<
      IBlogCategory,
      {
        id: string
        // @ts-ignore
        data: IUpdateBlogCategoryPayload
      }
    >({
      query: ({ id, data }) => ({
        url: `/blogs-category/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: BlogCategoryResponse) => response.data as IBlogCategory,

      invalidatesTags: ['Category'],
    }),
    // delete team api
    deleteBlogCategory: builder.mutation<IBlogCategory, string>({
      query: (id) => ({
        url: `/blogs-category/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: BlogCategoryResponse) => response.data as IBlogCategory,

      invalidatesTags: ['Category'],
    }),
  }),
})

export const {
  useGetBlogCategoryQuery,
  useGetBlogCategoryByIdQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogCategoryApi
