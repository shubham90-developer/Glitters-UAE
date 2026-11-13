import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IPrivacy {
  _id: string
  badgeTitle: string
  title: string
  shortDesc: string
  content: string
  userId: string
}

export type PrivacyPayload = Pick<IPrivacy, 'badgeTitle' | 'title' | 'shortDesc' | 'content'>

interface IPrivacyResponse {
  success: boolean
  statusCode: number
  message: string
  data: IPrivacy | IPrivacy[]
}

export const privacyApi = createApi({
  reducerPath: 'privacyApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),

  tagTypes: ['Privacy'],

  endpoints: (builder) => ({
    getPrivacy: builder.query<IPrivacy[], void>({
      query: () => '/privacy-policy',

      transformResponse: (response: IPrivacyResponse) => {
        if (Array.isArray(response.data)) return response.data

        return response.data ? [response.data] : []
      },

      providesTags: ['Privacy'],
    }),

    createPrivacy: builder.mutation<IPrivacy, PrivacyPayload>({
      query: (body) => ({
        url: '/privacy-policy',
        method: 'POST',
        body,
      }),

      transformResponse: (response: IPrivacyResponse) => response.data as IPrivacy,

      invalidatesTags: ['Privacy'],
    }),

    updatePrivacy: builder.mutation<IPrivacy, { _id: string } & PrivacyPayload>({
      query: ({ _id, ...body }) => ({
        url: `/privacy-policy/${_id}`,
        method: 'PUT',
        body,
      }),

      transformResponse: (response: IPrivacyResponse) => response.data as IPrivacy,

      invalidatesTags: ['Privacy'],
    }),
  }),
})

export const { useGetPrivacyQuery, useCreatePrivacyMutation, useUpdatePrivacyMutation } = privacyApi
