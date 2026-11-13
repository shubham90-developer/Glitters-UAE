import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface IBlog {
  _id: string

  category: string

  title: string
  shortDesc: string

  author: string

  featured: boolean

  image: string

  description: string

  QuickTips: string

  blackQuote: string

  tags: string

  writtenBy: string
  writtenByImage: string
  writtenByDesc: string

  metaTitle: string
  metaDesc: string
  metaTags: string
  status: string
  isDeleted: boolean

  createdAt: string
  updatedAt: string
}

interface BlogResponse {
  success: boolean
  statusCode: number
  message: string
  data: IBlog | IBlog[]
}

export const blogApi = createApi({
  reducerPath: 'blogApi',

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

  tagTypes: ['Blog'],

  endpoints: (builder) => ({
    getBlog: builder.query<IBlog[], void>({
      query: () => ({
        url: '/blogs',
        method: 'GET',
      }),

      transformResponse: (response: BlogResponse): IBlog[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Blog'],
    }),

    // single
    getBlogById: builder.query<IBlog, string>({
      query: (id) => `/blogs/${id}`,
      transformResponse: (response: BlogResponse) => response.data as IBlog,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    // create team api
    createBlog: builder.mutation<IBlog, FormData>({
      query: (formData) => ({
        url: '/blogs',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: BlogResponse) => response.data as IBlog,

      invalidatesTags: ['Blog'],
    }),

    // update team api
    updateBlog: builder.mutation<IBlog, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: BlogResponse) => response.data as IBlog,
      invalidatesTags: ['Blog'],
    }),

    // delete team api
    deleteBlog: builder.mutation<IBlog, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: BlogResponse) => response.data as IBlog,

      invalidatesTags: ['Blog'],
    }),
  }),
})

export const { useGetBlogQuery, useGetBlogByIdQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } = blogApi
