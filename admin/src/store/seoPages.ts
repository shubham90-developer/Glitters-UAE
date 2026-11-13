import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '@/store'

export interface ISEOPages {
  _id: string

  productListBgImages: string[]
  wishListBgImages: string[]

  status: 'active' | 'inactive'

  isDeleted: boolean

  createdAt: string
  updatedAt: string
}

interface SEOPagesResponse {
  success: boolean
  statusCode: number
  message: string

  data: ISEOPages | ISEOPages[]
}

export const seoPagesApi = createApi({
  reducerPath: 'seoPagesApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      // IMPORTANT:
      // Content-Type manually set mat karo.
      // FormData ke liye browser boundary set karega.

      return headers
    },
  }),

  tagTypes: ['SEOPages'],

  endpoints: (builder) => ({
    // ==========================================
    // GET ALL
    // ==========================================

    getSEOPages: builder.query<ISEOPages[], void>({
      query: () => ({
        url: '/seo-pages',
        method: 'GET',
      }),

      transformResponse: (response: SEOPagesResponse): ISEOPages[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['SEOPages'],
    }),

    // ==========================================
    // GET BY ID
    // ==========================================

    getSEOPagesById: builder.query<ISEOPages, string>({
      query: (id) => ({
        url: `/seo-pages/${id}`,
        method: 'GET',
      }),

      transformResponse: (response: SEOPagesResponse) => response.data as ISEOPages,

      providesTags: (result, error, id) => [
        {
          type: 'SEOPages',
          id,
        },
      ],
    }),

    // ==========================================
    // CREATE
    // ==========================================

    createSEOPages: builder.mutation<ISEOPages, FormData>({
      query: (formData) => ({
        url: '/seo-pages',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: SEOPagesResponse) => response.data as ISEOPages,

      invalidatesTags: ['SEOPages'],
    }),

    // ==========================================
    // UPDATE
    // ==========================================

    updateSEOPages: builder.mutation<
      ISEOPages,
      {
        id: string
        data: FormData
      }
    >({
      query: ({ id, data }) => ({
        url: `/seo-pages/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: SEOPagesResponse) => response.data as ISEOPages,

      invalidatesTags: ['SEOPages'],
    }),

    // ==========================================
    // DELETE
    // ==========================================

    deleteSEOPages: builder.mutation<ISEOPages, string>({
      query: (id) => ({
        url: `/seo-pages/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: SEOPagesResponse) => response.data as ISEOPages,

      invalidatesTags: ['SEOPages'],
    }),
  }),
})

export const { useGetSEOPagesQuery, useGetSEOPagesByIdQuery, useCreateSEOPagesMutation, useUpdateSEOPagesMutation, useDeleteSEOPagesMutation } =
  seoPagesApi
