import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ITerms {
  _id: string;
  badgeTitle: string;
  title: string;
  shortDesc: string;
  content: string;
  userId: string;
}

interface ITermsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ITerms | ITerms[];
}

export const termsApi = createApi({
  reducerPath: "termsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Terms"],

  endpoints: (builder) => ({
    // GET Terms
    getTerms: builder.query<ITerms[], void>({
      query: () => ({
        url: "/terms-and-conditions",
        method: "GET",
      }),

      transformResponse: (response: ITermsResponse) => {
        if (Array.isArray(response.data)) {
          return response.data;
        }

        return response.data ? [response.data] : [];
      },

      providesTags: ["Terms"],
    }),

    // CREATE Terms
    createTerms: builder.mutation<
      ITerms,
      {
        content: string;
      }
    >({
      query: (body) => ({
        url: "/terms-and-conditions",
        method: "POST",
        body,
      }),

      transformResponse: (response: ITermsResponse) => response.data as ITerms,

      invalidatesTags: ["Terms"],
    }),

    // UPDATE Terms
    updateTerms: builder.mutation<
      ITerms,
      {
        _id: string;
        content: string;
      }
    >({
      query: ({ _id, content }) => ({
        url: `/terms-and-conditions/${_id}`,
        method: "PUT",
        body: {
          content,
        },
      }),

      transformResponse: (response: ITermsResponse) => response.data as ITerms,

      invalidatesTags: ["Terms"],
    }),
  }),
});

export const {
  useGetTermsQuery,
  useCreateTermsMutation,
  useUpdateTermsMutation,
} = termsApi;
