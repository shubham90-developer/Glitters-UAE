import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type GeneralSettings = {
  _id: string
  logo: string
  favicon: string
  footerImg: string
  mobileNo: string
  alternateMobileNo: string
  mail: string
  alternateEmail: string
  address: string
  addressIframe: string
  workingHrs: string
  facebook: string
  instagram: string
  youtube: string
  linkedin: string
  twitter: string
  whatsApp: string
  topHeaderTitle: string
  footerInfo: string
  footerCopyrights: string
  googlePlayUrl: string
  appStoreUrl: string
  username: string
  createdAt?: string
  updatedAt?: string
}

export type GeneralSettingsImageField = 'logo' | 'favicon' | 'footerImg'

export type GeneralSettingsPayload = Partial<Omit<GeneralSettings, '_id' | 'createdAt' | 'updatedAt' | GeneralSettingsImageField>> & {
  password?: string
  logo?: File | string | null
  favicon?: File | string | null
  footerImg?: File | string | null
}

// Adjust to match what your controller returns
type ApiResponse<T> = {
  success?: boolean
  message?: string
  data: T
}

const toFormData = (payload: GeneralSettingsPayload) => {
  const fd = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (value instanceof File) {
      fd.append(key, value) // new upload
    } else {
      fd.append(key, String(value)) // text / existing image url
    }
  })

  return fd
}

export const generalSettingsApi = createApi({
  reducerPath: 'generalSettingsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ['GeneralSettings'],

  endpoints: (builder) => ({
    /* GET /settings */
    getAllGeneralSettings: builder.query<GeneralSettings[], void>({
      query: () => '/settings',
      transformResponse: (res: ApiResponse<GeneralSettings[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({
                type: 'GeneralSettings' as const,
                id: s._id,
              })),
              { type: 'GeneralSettings', id: 'LIST' },
            ]
          : [{ type: 'GeneralSettings', id: 'LIST' }],
    }),

    getGeneralSettingsById: builder.query<GeneralSettings, string>({
      query: (id) => `/settings/${id}`,
      transformResponse: (res: ApiResponse<GeneralSettings>) => res.data,
      providesTags: (_res, _err, id) => [{ type: 'GeneralSettings', id }],
    }),

    /* POST /settings (multipart) */
    createGeneralSettings: builder.mutation<GeneralSettings, GeneralSettingsPayload>({
      query: (body) => ({
        url: '/settings',
        method: 'POST',
        body: toFormData(body),
      }),
      transformResponse: (res: ApiResponse<GeneralSettings>) => res.data,
      invalidatesTags: [{ type: 'GeneralSettings', id: 'LIST' }],
    }),

    /* PUT /settings/:id (multipart) */
    updateGeneralSettings: builder.mutation<GeneralSettings, { id: string; body: GeneralSettingsPayload }>({
      query: ({ id, body }) => ({
        url: `/settings/${id}`,
        method: 'PUT',
        body: toFormData(body),
      }),
      transformResponse: (res: ApiResponse<GeneralSettings>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'GeneralSettings', id },
        { type: 'GeneralSettings', id: 'LIST' },
      ],
    }),

    /* DELETE /settings/:id */
    deleteGeneralSettings: builder.mutation<{ message?: string }, string>({
      query: (id) => ({
        url: `/settings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'GeneralSettings', id },
        { type: 'GeneralSettings', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetAllGeneralSettingsQuery,
  useGetGeneralSettingsByIdQuery,
  useCreateGeneralSettingsMutation,
  useUpdateGeneralSettingsMutation,
  useDeleteGeneralSettingsMutation,
} = generalSettingsApi
