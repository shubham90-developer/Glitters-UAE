import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ICounter {
  _id: string
  title: string
  subTitle: string
  happyCustomers: string
  products: string
  ordersDelivered: string
  customerRating: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface CounterResponse {
  success: boolean
  statusCode: number
  message: string
  data: ICounter | ICounter[]
}

export const counterApi = createApi({
  reducerPath: 'counterApi',

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

  tagTypes: ['Counter'],

  endpoints: (builder) => ({
    getCounter: builder.query<ICounter[], void>({
      query: () => ({
        url: '/counter',
        method: 'GET',
      }),

      transformResponse: (response: CounterResponse): ICounter[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Counter'],
    }),

    // single
    getCounterById: builder.query<ICounter, string>({
      query: (id) => `/counter/${id}`,
      transformResponse: (response: CounterResponse) => response.data as ICounter,
      providesTags: (result, error, id) => [{ type: 'Counter', id }],
    }),

    // create team api
    createCounter: builder.mutation<ICounter, FormData>({
      query: (formData) => ({
        url: '/counter',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: CounterResponse) => response.data as ICounter,

      invalidatesTags: ['Counter'],
    }),

    // update team api
    updateCounter: builder.mutation<ICounter, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/counter/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: CounterResponse) => response.data as ICounter,
      invalidatesTags: ['Counter'],
    }),

    // delete team api
    deleteCounter: builder.mutation<ICounter, string>({
      query: (id) => ({
        url: `/counter/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: CounterResponse) => response.data as ICounter,

      invalidatesTags: ['Counter'],
    }),
  }),
})

export const { useGetCounterQuery, useGetCounterByIdQuery, useCreateCounterMutation, useUpdateCounterMutation, useDeleteCounterMutation } = counterApi
