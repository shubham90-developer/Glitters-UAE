import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ITestimonials {
  _id: string
  image: string
  name: string
  designation: string
  description: string
  rating: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface TestimonialsResponse {
  success: boolean
  statusCode: number
  message: string
  data: ITestimonials | ITestimonials[]
}

export const testimonialsApi = createApi({
  reducerPath: 'testimonialsApi',

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

  tagTypes: ['Testimonials'],

  endpoints: (builder) => ({
    getTestimonials: builder.query<ITestimonials[], void>({
      query: () => ({
        url: '/testimonials',
        method: 'GET',
      }),

      transformResponse: (response: TestimonialsResponse): ITestimonials[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Testimonials'],
    }),

    // single
    getTestimonialsById: builder.query<ITestimonials, string>({
      query: (id) => `/testimonials/${id}`,
      transformResponse: (response: TestimonialsResponse) => response.data as ITestimonials,
      providesTags: (result, error, id) => [{ type: 'Testimonials', id }],
    }),

    // create team api
    createTestimonials: builder.mutation<ITestimonials, FormData>({
      query: (formData) => ({
        url: '/testimonials',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: TestimonialsResponse) => response.data as ITestimonials,

      invalidatesTags: ['Testimonials'],
    }),

    // update team api
    updateTestimonials: builder.mutation<ITestimonials, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/testimonials/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: TestimonialsResponse) => response.data as ITestimonials,
      invalidatesTags: ['Testimonials'],
    }),

    // delete team api
    deleteTestimonials: builder.mutation<ITestimonials, string>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: TestimonialsResponse) => response.data as ITestimonials,

      invalidatesTags: ['Testimonials'],
    }),
  }),
})

export const {
  useGetTestimonialsQuery,
  useGetTestimonialsByIdQuery,
  useCreateTestimonialsMutation,
  useUpdateTestimonialsMutation,
  useDeleteTestimonialsMutation,
} = testimonialsApi
