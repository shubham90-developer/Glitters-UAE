import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ICategoryRef {
  _id: string
  categoryName?: string
  slug?: string
}

export interface ISubCategory {
  _id: string

  category: string | ICategoryRef

  img?: string

  subCategoryName: string

  status: 'active' | 'inactive'

  isDeleted: boolean

  createdAt: string
  updatedAt: string
}

interface SubCategoryResponse {
  success: boolean
  statusCode: number
  message: string
  data: ISubCategory | ISubCategory[]
}

export const subCategoryApi = createApi({
  reducerPath: 'subCategoryApi',

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

  tagTypes: ['SubCategory'],

  endpoints: (builder) => ({
    getSubCategory: builder.query<ISubCategory[], void>({
      query: () => ({
        url: '/sub-categories',
        method: 'GET',
      }),

      transformResponse: (response: SubCategoryResponse): ISubCategory[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['SubCategory'],
    }),

    // single
    getSubCategoryById: builder.query<ISubCategory, string>({
      query: (id) => `/sub-categories/${id}`,
      transformResponse: (response: SubCategoryResponse) => response.data as ISubCategory,
      providesTags: (result, error, id) => [{ type: 'SubCategory', id }],
    }),

    // create team api
    createSubCategory: builder.mutation<ISubCategory, FormData>({
      query: (formData) => ({
        url: '/sub-categories',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: SubCategoryResponse) => response.data as ISubCategory,

      invalidatesTags: ['SubCategory'],
    }),

    // update team api
    updateSubCategory: builder.mutation<ISubCategory, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/sub-categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: SubCategoryResponse) => response.data as ISubCategory,
      invalidatesTags: ['SubCategory'],
    }),

    // delete team api
    deleteSubCategory: builder.mutation<ISubCategory, string>({
      query: (id) => ({
        url: `/sub-categories/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: SubCategoryResponse) => response.data as ISubCategory,

      invalidatesTags: ['SubCategory'],
    }),
  }),
})

export const {
  useGetSubCategoryQuery,
  useGetSubCategoryByIdQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi
