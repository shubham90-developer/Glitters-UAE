import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IPrivacy {
  _id: string;
  badgeTitle: string;
  title: string;
  shortDesc: string;
  content: string;
  userId: string;
}

interface IPrivacyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IPrivacy | IPrivacy[];
}

export const privacyApi = createApi({
  reducerPath: "privacyApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Privacy"],

  endpoints: (builder) => ({
    // GET Privacy
    getPrivacy: builder.query<IPrivacy[], void>({
      query: () => ({
        url: "/privacy-policy",
        method: "GET",
      }),

      transformResponse: (response: IPrivacyResponse) => {
        if (Array.isArray(response.data)) {
          return response.data;
        }

        return response.data ? [response.data] : [];
      },

      providesTags: ["Privacy"],
    }),

    // CREATE Privacy
    createPrivacy: builder.mutation<
      IPrivacy,
      {
        content: string;
      }
    >({
      query: (body) => ({
        url: "/privacy-policy",
        method: "POST",
        body,
      }),

      transformResponse: (response: IPrivacyResponse) =>
        response.data as IPrivacy,

      invalidatesTags: ["Privacy"],
    }),

    // UPDATE Privacy
    updatePrivacy: builder.mutation<
      IPrivacy,
      {
        _id: string;
        content: string;
      }
    >({
      query: ({ _id, content }) => ({
        url: `/privacy-policy/${_id}`,
        method: "PUT",
        body: {
          content,
        },
      }),

      transformResponse: (response: IPrivacyResponse) =>
        response.data as IPrivacy,

      invalidatesTags: ["Privacy"],
    }),
  }),
});

export const {
  useGetPrivacyQuery,
  useCreatePrivacyMutation,
  useUpdatePrivacyMutation,
} = privacyApi;
