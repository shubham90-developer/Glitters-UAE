import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IHomeBanner {
  _id: string;
  title: string;
  subTitle: string;
  shortDesc: string;
  bgVideo: string;
  banner: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HomeBannerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IHomeBanner | IHomeBanner[];
}

export const homeBannerApi = createApi({
  reducerPath: "homeBannerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["HomeBanner"],

  endpoints: (builder) => ({
    getHomeBanner: builder.query<IHomeBanner[], void>({
      query: () => ({
        url: "/home-banner",
        method: "GET",
      }),

      transformResponse: (response: HomeBannerResponse): IHomeBanner[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["HomeBanner"],
    }),
  }),
});

export const { useGetHomeBannerQuery } = homeBannerApi;
