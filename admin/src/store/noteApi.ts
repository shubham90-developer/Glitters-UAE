import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface INotes {
  _id: string
  content: string
  userId: string
}

interface INotesResponse {
  success: boolean
  statusCode: number
  message: string
  data: INotes | INotes[]
}

export const noteApi = createApi({
  reducerPath: 'noteApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json')

      return headers
    },
  }),

  tagTypes: ['Notes'],

  endpoints: (builder) => ({
    // GET NOTES
    getNote: builder.query<INotes[], void>({
      query: () => ({
        url: '/notes',
        method: 'GET',
      }),

      transformResponse: (response: INotesResponse) => {
        if (Array.isArray(response.data)) {
          return response.data
        }

        return response.data ? [response.data] : []
      },

      providesTags: ['Notes'],
    }),

    // CREATE NOTE
    createNotes: builder.mutation<
      INotes,
      {
        content: string
      }
    >({
      query: (body) => ({
        url: '/notes',
        method: 'POST',
        body,
      }),

      transformResponse: (response: INotesResponse) => response.data as INotes,

      invalidatesTags: ['Notes'],
    }),

    // UPDATE NOTE
    updateNotes: builder.mutation<
      INotes,
      {
        _id: string
        content: string
      }
    >({
      query: ({ _id, content }) => ({
        url: `/notes/${_id}`,
        method: 'PUT',
        body: {
          content,
        },
      }),

      transformResponse: (response: INotesResponse) => response.data as INotes,

      invalidatesTags: ['Notes'],
    }),
  }),
})

export const { useGetNoteQuery, useCreateNotesMutation, useUpdateNotesMutation } = noteApi
