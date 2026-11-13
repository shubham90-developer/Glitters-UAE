import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IFaq {
  _id: string;
  category: string;
  question: string;
  answer: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FaqResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IFaq | IFaq[];
}

export const faqApi = createApi({
  reducerPath: "faqApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Faq"],

  endpoints: (builder) => ({
    getFaq: builder.query<IFaq[], void>({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),

      transformResponse: (response: FaqResponse): IFaq[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["Faq"],
    }),

    // single
    getFaqById: builder.query<IFaq, string>({
      query: (id) => `/faq/${id}`,
      transformResponse: (response: FaqResponse) => response.data as IFaq,
      providesTags: (result, error, id) => [{ type: "Faq", id }],
    }),

    // create team api
    createFaq: builder.mutation<IFaq, FormData>({
      query: (formData) => ({
        url: "/faq",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: FaqResponse) => response.data as IFaq,

      invalidatesTags: ["Faq"],
    }),

    // update team api
    updateFaq: builder.mutation<IFaq, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/faq/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: FaqResponse) => response.data as IFaq,
      invalidatesTags: ["Faq"],
    }),

    // delete team api
    deleteFaq: builder.mutation<IFaq, string>({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: FaqResponse) => response.data as IFaq,

      invalidatesTags: ["Faq"],
    }),
  }),
});

export const {
  useGetFaqQuery,
  useGetFaqByIdQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
