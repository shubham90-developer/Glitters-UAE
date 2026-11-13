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

export interface IOfferBanner {
  _id: string

  category: string | ICategoryRef

  subCategory?: string | ISubCategoryRef | null

  offerBannerImg: string

  redirectUrl?: string

  status: 'active' | 'inactive'

  isDeleted: boolean

  createdAt: string
  updatedAt: string
}

interface offerBannerResponse {
  success: boolean
  statusCode: number
  message: string
  data: IOfferBanner | IOfferBanner[]
}

export const offerBannerApi = createApi({
  reducerPath: 'offerBannerApi',

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

  tagTypes: ['OfferBanner'],

  endpoints: (builder) => ({
    getOfferBanner: builder.query<IOfferBanner[], void>({
      query: () => ({
        url: '/offer-banner',
        method: 'GET',
      }),

      transformResponse: (response: offerBannerResponse): IOfferBanner[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['OfferBanner'],
    }),

    // single
    getOfferBannerById: builder.query<IOfferBanner, string>({
      query: (id) => `/offer-banner/${id}`,
      transformResponse: (response: offerBannerResponse) => response.data as IOfferBanner,
      providesTags: (result, error, id) => [{ type: 'OfferBanner', id }],
    }),

    // create team api
    createOfferBanner: builder.mutation<IOfferBanner, FormData>({
      query: (formData) => ({
        url: '/offer-banner',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: offerBannerResponse) => response.data as IOfferBanner,

      invalidatesTags: ['OfferBanner'],
    }),

    // update team api
    updateOfferBanner: builder.mutation<IOfferBanner, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/offer-banner/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: offerBannerResponse) => response.data as IOfferBanner,
      invalidatesTags: ['OfferBanner'],
    }),

    // delete team api
    deleteOfferBanner: builder.mutation<IOfferBanner, string>({
      query: (id) => ({
        url: `/offer-banner/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: offerBannerResponse) => response.data as IOfferBanner,

      invalidatesTags: ['OfferBanner'],
    }),
  }),
})

export const {
  useGetOfferBannerQuery,
  useGetOfferBannerByIdQuery,
  useCreateOfferBannerMutation,
  useUpdateOfferBannerMutation,
  useDeleteOfferBannerMutation,
} = offerBannerApi
