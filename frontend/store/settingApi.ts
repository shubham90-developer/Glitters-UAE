import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ISetting {
  _id?: string;
  id?: string;

  logo?: string;
  favicon?: string;
  footerImg?: string;

  mobileNo?: string;
  alternateMobileNo?: string;

  mail?: string;
  alternateEmail?: string;

  address?: string;
  addressIframe?: string;
  workingHrs?: string;

  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  whatsApp?: string;

  topHeaderTitle?: string;
  footerInfo?: string;
  footerCopyrights?: string;

  googlePlayUrl?: string;
  appStoreUrl?: string;

  username?: string;
  password?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface ISettingResponse {
  message: string;
  success: boolean;
  statusCode: number;
  data: ISetting | ISetting[];
}

export const settingApi = createApi({
  reducerPath: "settingApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Setting"],

  endpoints: (builder) => ({
    getSettings: builder.query<ISetting[], void>({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),

      transformResponse: (response: ISettingResponse): ISetting[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["Setting"],
    }),

    // single
    getSettingById: builder.query<ISetting, string>({
      query: (id) => ({
        url: `/settings/${id}`,
        method: "GET",
      }),

      transformResponse: (response: ISettingResponse) =>
        response.data as ISetting,

      providesTags: (result, error, id) => [{ type: "Setting", id }],
    }),

    // create setting
    createSetting: builder.mutation<ISetting, ISetting>({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        body: data,
      }),

      transformResponse: (response: ISettingResponse) =>
        response.data as ISetting,

      invalidatesTags: ["Setting"],
    }),

    // update setting
    updateSetting: builder.mutation<
      ISetting,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/settings/${id}`,
        method: "PUT",
        body: formData,
      }),

      transformResponse: (response: ISettingResponse) =>
        response.data as ISetting,

      invalidatesTags: ["Setting"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSettingByIdQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
} = settingApi;
