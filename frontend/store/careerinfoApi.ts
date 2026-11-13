import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IEmployeeBenefit {
  title?: string;
  description?: string;
  icon?: string;
}

export interface ICulturePoint {
  title?: string;
  description?: string;
}

export interface IHiringProcessItem {
  step?: string;
  title?: string;
  description?: string;
}

export interface ICareerInfo {
  _id: string;

  badgeText: string;

  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;

  benefitsLabel: string;
  benefitsTitle: string;
  employeeBenefits: IEmployeeBenefit[];

  cultureTitle: string;
  cultureDescription: string;
  culturePoints: ICulturePoint[];

  hiringProcessLabel: string;
  hiringProcessTitle: string;
  hiringProcess: IHiringProcessItem[];

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface CareerInfoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICareerInfo | ICareerInfo[];
}

export const careerInfoApi = createApi({
  reducerPath: "careerInfoApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ["CareerInfo"],

  endpoints: (builder) => ({
    getCareerInfo: builder.query<ICareerInfo[], void>({
      query: () => ({
        url: "/career-info",
        method: "GET",
      }),

      transformResponse: (response: CareerInfoResponse): ICareerInfo[] => {
        return Array.isArray(response.data) ? response.data : [response.data];
      },

      providesTags: ["CareerInfo"],
    }),

    // single
    getCareerInfoById: builder.query<ICareerInfo, string>({
      query: (id) => `/career-info/${id}`,
      transformResponse: (response: CareerInfoResponse) =>
        response.data as ICareerInfo,
      providesTags: (result, error, id) => [{ type: "CareerInfo", id }],
    }),

    // create team api
    createCareerInfo: builder.mutation<ICareerInfo, FormData>({
      query: (formData) => ({
        url: "/career-info",
        method: "POST",
        body: formData,
      }),

      transformResponse: (response: CareerInfoResponse) =>
        response.data as ICareerInfo,

      invalidatesTags: ["CareerInfo"],
    }),

    // update team api
    updateCareerInfo: builder.mutation<
      ICareerInfo,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/career-info/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: CareerInfoResponse) =>
        response.data as ICareerInfo,
      invalidatesTags: ["CareerInfo"],
    }),

    // delete team api
    deleteCareerInfo: builder.mutation<ICareerInfo, string>({
      query: (id) => ({
        url: `/career-info/${id}`,
        method: "DELETE",
      }),

      transformResponse: (response: CareerInfoResponse) =>
        response.data as ICareerInfo,

      invalidatesTags: ["CareerInfo"],
    }),
  }),
});

export const {
  useGetCareerInfoQuery,
  useGetCareerInfoByIdQuery,
  useCreateCareerInfoMutation,
  useUpdateCareerInfoMutation,
  useDeleteCareerInfoMutation,
} = careerInfoApi;
