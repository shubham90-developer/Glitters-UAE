import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ICategoryRef {
  _id: string
  categoryName?: string
  slug?: string
}
export interface ISubCategoryRef {
  _id: string
  subCategoryName?: string
  slug?: string
}

export interface ITopSaleBanner {
  _id: string

  // current backend fields
  offerBannerImg1: string
  offerBannerImg2: string
  offerBannerImg3: string

  // clickable link for each banner (empty string = no link)
  offerBannerLink1?: string
  offerBannerLink2?: string
  offerBannerLink3?: string

  status: 'active' | 'inactive'

  isDeleted: boolean

  createdAt: string
  updatedAt: string

  // legacy fields (not in the current backend model, kept so existing code still compiles)
  category?: string | ICategoryRef
  subCategory?: string | ISubCategoryRef | null
  offerBannerImg?: string
  redirectUrl?: string
}

interface topSaleBannerResponse {
  success: boolean
  statusCode: number
  message: string
  data: ITopSaleBanner | ITopSaleBanner[]
}

export const topSaleBannerApi = createApi({
  reducerPath: 'topSaleBannerApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      // Content-Type is not set here on purpose.
      // For JSON bodies fetchBaseQuery sets it automatically, and for FormData
      // the browser sets multipart/form-data with the correct boundary.

      return headers
    },
  }),

  tagTypes: ['topSaleBanner'],

  endpoints: (builder) => ({
    getTopSaleBanner: builder.query<ITopSaleBanner[], void>({
      query: () => ({
        url: '/top-sale-banner',
        method: 'GET',
      }),

      transformResponse: (response: topSaleBannerResponse): ITopSaleBanner[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['topSaleBanner'],
    }),

    // single
    getTopSaleBannerById: builder.query<ITopSaleBanner, string>({
      query: (id) => `/top-sale-banner/${id}`,
      transformResponse: (response: topSaleBannerResponse) => response.data as ITopSaleBanner,
      providesTags: (result, error, id) => [{ type: 'topSaleBanner', id }],
    }),

    // create banner
    createTopSaleBanner: builder.mutation<ITopSaleBanner, FormData>({
      query: (formData) => ({
        url: '/top-sale-banner',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: topSaleBannerResponse) => response.data as ITopSaleBanner,

      invalidatesTags: ['topSaleBanner'],
    }),

    // update banner
    updateTopSaleBanner: builder.mutation<ITopSaleBanner, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/top-sale-banner/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: topSaleBannerResponse) => response.data as ITopSaleBanner,
      invalidatesTags: ['topSaleBanner'],
    }),

    // delete banner
    deleteTopSaleBanner: builder.mutation<ITopSaleBanner, string>({
      query: (id) => ({
        url: `/top-sale-banner/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: topSaleBannerResponse) => response.data as ITopSaleBanner,

      invalidatesTags: ['topSaleBanner'],
    }),
  }),
})

export const {
  useGetTopSaleBannerQuery,
  useGetTopSaleBannerByIdQuery,
  useCreateTopSaleBannerMutation,
  useUpdateTopSaleBannerMutation,
  useDeleteTopSaleBannerMutation,
} = topSaleBannerApi
