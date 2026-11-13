import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface IAppBanner {
  _id: string
  AppBanner: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface AppBannerResponse {
  success: boolean
  statusCode: number
  message: string
  data: IAppBanner | IAppBanner[]
}

export const appBannerApi = createApi({
  reducerPath: 'appBannerApi',

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

  tagTypes: ['AppBanner'],

  endpoints: (builder) => ({
    getAppBanner: builder.query<IAppBanner[], void>({
      query: () => ({
        url: '/app-banner',
        method: 'GET',
      }),

      transformResponse: (response: AppBannerResponse): IAppBanner[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['AppBanner'],
    }),

    // single
    getAppBannerById: builder.query<IAppBanner, string>({
      query: (id) => `/app-banner/${id}`,
      transformResponse: (response: AppBannerResponse) => response.data as IAppBanner,
      providesTags: (result, error, id) => [{ type: 'AppBanner', id }],
    }),

    // create team api
    createAppBanner: builder.mutation<IAppBanner, FormData>({
      query: (formData) => ({
        url: '/app-banner',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: AppBannerResponse) => response.data as IAppBanner,

      invalidatesTags: ['AppBanner'],
    }),

    // update team api
    updateAppBanner: builder.mutation<IAppBanner, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/app-banner/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: AppBannerResponse) => response.data as IAppBanner,
      invalidatesTags: ['AppBanner'],
    }),

    // delete team api
    deleteAppBanner: builder.mutation<IAppBanner, string>({
      query: (id) => ({
        url: `/app-banner/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: AppBannerResponse) => response.data as IAppBanner,

      invalidatesTags: ['AppBanner'],
    }),
  }),
})

export const { useGetAppBannerQuery, useGetAppBannerByIdQuery, useCreateAppBannerMutation, useUpdateAppBannerMutation, useDeleteAppBannerMutation } =
  appBannerApi
