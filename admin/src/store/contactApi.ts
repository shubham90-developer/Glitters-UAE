import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface IContact {
  _id: string
  firstName: string
  lastName: string
  fullName: string
  emailAddress: string
  phone: string
  subject: string
  orderNo: string
  message: string
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export type ContactPayload = Pick<IContact, 'firstName' | 'lastName' | 'emailAddress' | 'phone' | 'subject' | 'orderNo' | 'message'>

interface ContactResponse {
  success: boolean
  statusCode: number
  message: string
  data: IContact | IContact[]
}

export const contactApi = createApi({
  reducerPath: 'contactApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    // No manual Content-Type: fetchBaseQuery sets application/json for plain objects
    // and lets the browser set the multipart boundary for FormData bodies.
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),

  tagTypes: ['Contact'],

  endpoints: (builder) => ({
    getContact: builder.query<IContact[], void>({
      query: () => '/enquiries-contacts',

      transformResponse: (response: ContactResponse): IContact[] => (Array.isArray(response.data) ? response.data : [response.data]),

      providesTags: ['Contact'],
    }),

    getContactById: builder.query<IContact, string>({
      query: (id) => `/enquiries-contacts/${id}`,

      transformResponse: (response: ContactResponse) => response.data as IContact,

      providesTags: (result, error, id) => [{ type: 'Contact', id }],
    }),

    // Public contact form: sends the fields as JSON.
    createContact: builder.mutation<IContact, ContactPayload>({
      query: (body) => ({
        url: '/enquiries-contacts',
        method: 'POST',
        body,
      }),

      transformResponse: (response: ContactResponse) => response.data as IContact,

      invalidatesTags: ['Contact'],
    }),

    updateContact: builder.mutation<IContact, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/enquiries-contacts/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: ContactResponse) => response.data as IContact,

      invalidatesTags: ['Contact'],
    }),

    deleteContact: builder.mutation<IContact, string>({
      query: (id) => ({
        url: `/enquiries-contacts/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: ContactResponse) => response.data as IContact,

      invalidatesTags: ['Contact'],
    }),
  }),
})

export const { useGetContactQuery, useGetContactByIdQuery, useCreateContactMutation, useUpdateContactMutation, useDeleteContactMutation } = contactApi
