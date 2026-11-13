import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IAboutUs {
  _id: string;

  title: string;
  subTitle: string;
  shortDesc: string;

  ProductsCounter: string;
  CustomersCounter: string;
  DeliveriesCounter: string;
  Rating: string;

  trustedTitle: string;
  trustedDesc: string;

  storySubTitle: string;
  storyTitle: string;
  storyDesc: string;
  storySecondDesc: string;
  storyImg: string;

  customerFirstTitle: string;
  customerFirstDesc: string;

  qualityFocusTitle: string;
  qualityFocusDesc: string;

  transparentPricingTitle: string;
  transparentPricingDesc: string;

  reliableSupportTitle: string;
  reliableSupportDesc: string;

  valuesTitle: string;
  valuesSubTitle: string;

  CustomerFirstTitle: string;
  CustomerFirstDesc: string;

  TrustSecurityTitle: string;
  TrustSecurityDesc: string;

  QualityTitle: string;
  QualityDesc: string;

  ContinuousImprovementTitle: string;
  ContinuousImprovementDesc: string;

  whyShopSubTitle: string;
  whyShopTitle: string;
  whyShopDesc: string;

  wideSelectionTitle: string;
  wideSelectionDesc: string;

  fastDeliveryTitle: string;
  fastDeliveryDesc: string;

  secureCheckoutTitle: string;
  secureCheckoutDesc: string;

  easyReturnsTitle: string;
  easyReturnsDesc: string;

  promiseTitle: string;
  promiseDesc: string;

  promisePoint1: string;
  promisePoint2: string;
  promisePoint3: string;
  promisePoint4: string;

  status: "active" | "inactive";
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface AboutUsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAboutUs | IAboutUs[];
}

export const aboutUsApi = createApi({
  reducerPath: "aboutUsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["Teams"],

  endpoints: (builder) => ({
    getAboutUs: builder.query<IAboutUs[], void>({
      query: () => ({
        url: "/about-us",
        method: "GET",
      }),

      transformResponse: (response: AboutUsResponse): IAboutUs[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["Teams"],
    }),

    // single
    getAboutUsById: builder.query<IAboutUs, string>({
      query: (id) => `/home-banner/${id}`,
      transformResponse: (response: AboutUsResponse) =>
        response.data as IAboutUs,
      providesTags: (result, error, id) => [{ type: "Teams", id }],
    }),

    // create team api
    createAboutUs: builder.mutation<IAboutUs, FormData>({
      query: (formData) => ({
        url: "/about-us",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: AboutUsResponse) =>
        response.data as IAboutUs,

      invalidatesTags: ["Teams"],
    }),

    // update team api
    updateAboutUs: builder.mutation<IAboutUs, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/about-us/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: AboutUsResponse) =>
        response.data as IAboutUs,
      invalidatesTags: ["Teams"],
    }),

    // delete team api
    deleteAboutUs: builder.mutation<IAboutUs, string>({
      query: (id) => ({
        url: `/about-us/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: AboutUsResponse) =>
        response.data as IAboutUs,

      invalidatesTags: ["Teams"],
    }),
  }),
});

export const {
  useGetAboutUsQuery,
  useGetAboutUsByIdQuery,
  useCreateAboutUsMutation,
  useUpdateAboutUsMutation,
  useDeleteAboutUsMutation,
} = aboutUsApi;
