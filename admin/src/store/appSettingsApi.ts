import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IAppSetting {
  _id?: string
  applogo?: string
  appName?: string
  footerImg?: string
  footerName?: string

  mobileNo?: string
  alternateMobileNo?: string

  mail?: string
  alternateEmail?: string

  address?: string
  addressIframe?: string
  workingHrs?: string

  facebook?: string
  instagram?: string
  youtube?: string
  linkedin?: string
  twitter?: string
  whatsApp?: string

  googlePlayUrl?: string
  appStoreUrl?: string

  createdAt?: string
  updatedAt?: string
}

interface IAppSettingResponse {
  message: string
  success: boolean
  statusCode: number
  data: IAppSetting | IAppSetting[]
}

export const appSettingApi = createApi({
  reducerPath: 'appSettingApi',

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

  tagTypes: ['Setting'],

  endpoints: (builder) => ({
    getAppSettings: builder.query<IAppSetting[], void>({
      query: () => ({
        url: '/app-settings',
        method: 'GET',
      }),

      transformResponse: (response: IAppSettingResponse): IAppSetting[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['Setting'],
    }),

    // single
    getAppSettingsById: builder.query<IAppSetting, string>({
      query: (id) => ({
        url: `/app-settings/${id}`,
        method: 'GET',
      }),

      transformResponse: (response: IAppSettingResponse) => response.data as IAppSetting,

      providesTags: (result, error, id) => [{ type: 'Setting', id }],
    }),

    // create setting
    createAppSettings: builder.mutation<IAppSetting, IAppSetting>({
      query: (data) => ({
        url: '/app-settings',
        method: 'POST',
        body: data,
      }),

      transformResponse: (response: IAppSettingResponse) => response.data as IAppSetting,

      invalidatesTags: ['Setting'],
    }),

    // update setting
    updateAppSettings: builder.mutation<IAppSetting, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/app-settings/${id}`,
        method: 'PUT',
        body: formData,
      }),

      transformResponse: (response: IAppSettingResponse) => response.data as IAppSetting,

      invalidatesTags: ['Setting'],
    }),
  }),
})

export const { useGetAppSettingsQuery, useGetAppSettingsByIdQuery, useCreateAppSettingsMutation, useUpdateAppSettingsMutation } = appSettingApi
