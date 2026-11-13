import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface ITerms {
  _id: string
  badgeTitle: string
  title: string
  shortDesc: string
  content: string
  userId: string
}

export type TermsPayload = Pick<ITerms, 'badgeTitle' | 'title' | 'shortDesc' | 'content'>

interface ITermsResponse {
  success: boolean
  statusCode: number
  message: string
  data: ITerms | ITerms[]
}

export const termsApi = createApi({
  reducerPath: 'termsApi',

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

  tagTypes: ['Terms'],

  endpoints: (builder) => ({
    getTerms: builder.query<ITerms[], void>({
      query: () => '/terms-and-conditions',

      transformResponse: (response: ITermsResponse) => {
        if (Array.isArray(response.data)) return response.data

        return response.data ? [response.data] : []
      },

      providesTags: ['Terms'],
    }),

    createTerms: builder.mutation<ITerms, TermsPayload>({
      query: (body) => ({
        url: '/terms-and-conditions',
        method: 'POST',
        body,
      }),

      transformResponse: (response: ITermsResponse) => response.data as ITerms,

      invalidatesTags: ['Terms'],
    }),

    updateTerms: builder.mutation<ITerms, { _id: string } & TermsPayload>({
      query: ({ _id, ...body }) => ({
        url: `/terms-and-conditions/${_id}`,
        method: 'PUT',
        body,
      }),

      transformResponse: (response: ITermsResponse) => response.data as ITerms,

      invalidatesTags: ['Terms'],
    }),
  }),
})

export const { useGetTermsQuery, useCreateTermsMutation, useUpdateTermsMutation } = termsApi
