import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface IMediaCoverage {
  _id: string
  logo: string
  badgeTitle: string
  title: string
  desc: string
  url: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface MediaCoverageResponse {
  success: boolean
  statusCode: number
  message: string
  data: IMediaCoverage | IMediaCoverage[]
}

export const mediaCoverageApi = createApi({
  reducerPath: 'mediaCoverageApi',

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

  tagTypes: ['MediaCoverage'],

  endpoints: (builder) => ({
    getMediaCoverage: builder.query<IMediaCoverage[], void>({
      query: () => ({
        url: '/media-coverage',
        method: 'GET',
      }),

      transformResponse: (response: MediaCoverageResponse): IMediaCoverage[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['MediaCoverage'],
    }),

    // single
    getMediaCoverageById: builder.query<IMediaCoverage, string>({
      query: (id) => `/media-coverage/${id}`,
      transformResponse: (response: MediaCoverageResponse) => response.data as IMediaCoverage,
      providesTags: (result, error, id) => [{ type: 'MediaCoverage', id }],
    }),

    // create team api
    createMediaCoverage: builder.mutation<IMediaCoverage, FormData>({
      query: (formData) => ({
        url: '/media-coverage',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: MediaCoverageResponse) => response.data as IMediaCoverage,

      invalidatesTags: ['MediaCoverage'],
    }),

    // update team api
    updateMediaCoverage: builder.mutation<IMediaCoverage, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/media-coverage/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: MediaCoverageResponse) => response.data as IMediaCoverage,
      invalidatesTags: ['MediaCoverage'],
    }),

    // delete team api
    deleteMediaCoverage: builder.mutation<IMediaCoverage, string>({
      query: (id) => ({
        url: `/media-coverage/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: MediaCoverageResponse) => response.data as IMediaCoverage,

      invalidatesTags: ['MediaCoverage'],
    }),
  }),
})

export const {
  useGetMediaCoverageQuery,
  useGetMediaCoverageByIdQuery,
  useCreateMediaCoverageMutation,
  useUpdateMediaCoverageMutation,
  useDeleteMediaCoverageMutation,
} = mediaCoverageApi
