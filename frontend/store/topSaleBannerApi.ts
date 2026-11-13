import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ITopSaleBanner {
  _id: string;

  offerBannerImg1: string;
  offerBannerImg2: string;
  offerBannerImg3: string;

  // clickable link per banner (empty string = no link)
  offerBannerLink1?: string;
  offerBannerLink2?: string;
  offerBannerLink3?: string;

  status: "active" | "inactive";

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface topSaleBannerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ITopSaleBanner | ITopSaleBanner[];
}

export const topSaleBannerApi = createApi({
  reducerPath: "topSaleBannerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["topSaleBanner"],

  endpoints: (builder) => ({
    getTopSaleBanner: builder.query<ITopSaleBanner[], void>({
      query: () => ({
        url: "/top-sale-banner",
        method: "GET",
      }),

      transformResponse: (
        response: topSaleBannerResponse,
      ): ITopSaleBanner[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["topSaleBanner"],
    }),

    // single
    getTopSaleBannerById: builder.query<ITopSaleBanner, string>({
      query: (id) => `/top-sale-banner/${id}`,
      transformResponse: (response: topSaleBannerResponse) =>
        response.data as ITopSaleBanner,
      providesTags: (result, error, id) => [{ type: "topSaleBanner", id }],
    }),

    // create banner
    createTopSaleBanner: builder.mutation<ITopSaleBanner, FormData>({
      query: (formData) => ({
        url: "/top-sale-banner",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: topSaleBannerResponse) =>
        response.data as ITopSaleBanner,

      invalidatesTags: ["topSaleBanner"],
    }),

    // update banner
    updateTopSaleBanner: builder.mutation<
      ITopSaleBanner,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/top-sale-banner/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: topSaleBannerResponse) =>
        response.data as ITopSaleBanner,
      invalidatesTags: ["topSaleBanner"],
    }),

    // delete banner
    deleteTopSaleBanner: builder.mutation<ITopSaleBanner, string>({
      query: (id) => ({
        url: `/top-sale-banner/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: topSaleBannerResponse) =>
        response.data as ITopSaleBanner,

      invalidatesTags: ["topSaleBanner"],
    }),
  }),
});

export const {
  useGetTopSaleBannerQuery,
  useGetTopSaleBannerByIdQuery,
  useCreateTopSaleBannerMutation,
  useUpdateTopSaleBannerMutation,
  useDeleteTopSaleBannerMutation,
} = topSaleBannerApi;
