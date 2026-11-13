import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ICategoryRef {
  _id: string;
  categoryName?: string;
  slug?: string;
}
export interface ISubCategoryRef {
  _id: string;
  subCategoryName?: string;
  slug?: string;
}

export interface IOfferBanner {
  _id: string;

  category: string | ICategoryRef;

  subCategory?: string | ISubCategoryRef | null;

  offerBannerImg: string;

  redirectUrl?: string;

  status: "active" | "inactive";

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface offerBannerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IOfferBanner | IOfferBanner[];
}

export const offerBannerApi = createApi({
  reducerPath: "offerBannerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["OfferBanner"],

  endpoints: (builder) => ({
    getOfferBanner: builder.query<IOfferBanner[], void>({
      query: () => ({
        url: "/offer-banner",
        method: "GET",
      }),

      transformResponse: (response: offerBannerResponse): IOfferBanner[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["OfferBanner"],
    }),
  }),
});

export const { useGetOfferBannerQuery } = offerBannerApi;
