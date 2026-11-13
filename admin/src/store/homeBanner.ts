import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface IHomeBanner {
  _id: string
  title: string
  subTitle: string
  shortDesc: string
  bgVideo: string
  banner: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface HomeBannerResponse {
  success: boolean
  statusCode: number
  message: string
  data: IHomeBanner | IHomeBanner[]
}

export const homeBannerApi = createApi({
  reducerPath: 'homeBannerApi',

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

  tagTypes: ['Teams'],

  endpoints: (builder) => ({
    getHomeBanner: builder.query<IHomeBanner[], void>({
      query: () => ({
        url: '/home-banner',
        method: 'GET',
      }),

      transformResponse: (response: HomeBannerResponse): IHomeBanner[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Teams'],
    }),

    // single
    getHomeBannerById: builder.query<IHomeBanner, string>({
      query: (id) => `/home-banner/${id}`,
      transformResponse: (response: HomeBannerResponse) => response.data as IHomeBanner,
      providesTags: (result, error, id) => [{ type: 'Teams', id }],
    }),

    // create team api
    createHomeBanner: builder.mutation<IHomeBanner, FormData>({
      query: (formData) => ({
        url: '/home-banner',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: HomeBannerResponse) => response.data as IHomeBanner,

      invalidatesTags: ['Teams'],
    }),

    // update team api
    updateHomeBanner: builder.mutation<IHomeBanner, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/home-banner/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: HomeBannerResponse) => response.data as IHomeBanner,
      invalidatesTags: ['Teams'],
    }),

    // delete team api
    deleteHomeBanner: builder.mutation<IHomeBanner, string>({
      query: (id) => ({
        url: `/home-banner/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: HomeBannerResponse) => response.data as IHomeBanner,

      invalidatesTags: ['Teams'],
    }),
  }),
})

export const {
  useGetHomeBannerQuery,
  useGetHomeBannerByIdQuery,
  useCreateHomeBannerMutation,
  useUpdateHomeBannerMutation,
  useDeleteHomeBannerMutation,
} = homeBannerApi
